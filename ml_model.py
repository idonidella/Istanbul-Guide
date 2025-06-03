import pandas as pd
import numpy as np
from sklearn.preprocessing import RobustScaler
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam
import joblib
from math import radians, sin, cos, sqrt, atan2
import mysql.connector
from dotenv import load_dotenv
import os
from datetime import datetime
from sklearn.metrics.pairwise import haversine_distances
import logging
from sklearn.metrics import precision_score, recall_score, f1_score

class IstanbulMLRecommender:
    def __init__(self):
        self.places_df = None
        self.visited_df = None
        self.scaler = RobustScaler()
        self.model = None
        self.category_matrix = None
        self.feature_names = [
            'category_match',
            'visit_count',
            'distance_to_center',
            'category_popularity',
            'normalized_distance'
        ]
        self._category_popularity = None
        self._max_visits = None
        self._center_lat = 41.0082
        self._center_lon = 28.9784
        self.db_connection = None
        self.last_user_id = self.read_last_id('last_user_id.txt')
        self.last_place_id = self.read_last_id('last_place_id.txt')
        self.last_visit_id = self.read_last_id('last_visit_id.txt')
        

    def connect_to_database(self):
        load_dotenv()
        self.db_connection = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD', ''),
            database=os.getenv('DB_NAME', 'istanbul_guide')
        )
    

    def update_reference_ids(self):
        if self.db_connection is None:
            self.connect_to_database()
        cursor = self.db_connection.cursor(dictionary=True)
        
        # Önce mevcut max id'leri al
        cursor.execute("SELECT MAX(id) as max_id FROM users")
        max_user_id = cursor.fetchone()['max_id'] or 0
        cursor.execute("SELECT MAX(id) as max_id FROM places")
        max_place_id = cursor.fetchone()['max_id'] or 0
        cursor.execute("SELECT MAX(id) as max_id FROM visited_places")
        max_visit_id = cursor.fetchone()['max_id'] or 0
        
        
        
        self.db_connection.commit()
        cursor.close()


    def load_data_from_db(self):
        if self.db_connection is None:
            self.connect_to_database()
        cursor = self.db_connection.cursor(dictionary=True)
        places_query = """
            SELECT 
                p.id,
                p.name,
                p.description,
                p.latitude,
                p.longitude,
                p.qrCode,
                p.categoryId,
                c.name as category_name,
                COALESCE(COUNT(DISTINCT vp.id), 0) as visit_count
            FROM places p
            LEFT JOIN category c ON p.categoryId = c.id
            LEFT JOIN visited_places vp ON p.id = vp.placeId
            GROUP BY 
                p.id, p.name, p.description, p.latitude, p.longitude, p.qrCode, p.categoryId, c.name
        """
        cursor.execute(places_query)
        self.places_df = pd.DataFrame(cursor.fetchall())
        cursor.execute("SELECT * FROM visited_places")
        self.visited_df = pd.DataFrame(cursor.fetchall())
        cursor.close()
        self.places_df['latitude_rad'] = self.places_df['latitude'].apply(radians)
        self.places_df['longitude_rad'] = self.places_df['longitude'].apply(radians)
        self.category_matrix = pd.get_dummies(self.places_df['categoryId'])
        max_visits = self.places_df['visit_count'].max()
        if max_visits > 0:
            self.places_df['normalized_visits'] = self.places_df['visit_count'] / max_visits
        else:
            self.places_df['normalized_visits'] = 0
        self._category_popularity = self.visited_df.merge(
            self.places_df[['id', 'categoryId']], 
            left_on='placeId', 
            right_on='id'
        )['categoryId'].value_counts(normalize=True)
        self._max_visits = max_visits

    def calculate_distance(self, lat1, lon1, lat2, lon2):
        R = 6371
        lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * atan2(sqrt(a), sqrt(1-a))
        return R * c

    def normalize_distance(self, distance):
        max_distance = 20  # İstanbul'daki turistik yerler için daha makul bir mesafe
        return 1 - min(distance / max_distance, 1)

    def create_features(self):
        user_features = []
        category_popularity = self._category_popularity
        max_visits = self._max_visits if self._max_visits else 1
        user_ids = self.visited_df['userId'].unique()
        for user_id in user_ids:
            user_visits = self.visited_df[self.visited_df['userId'] == user_id]
            visited_place_ids = user_visits['placeId']
            visited_categories = self.places_df[self.places_df['id'].isin(visited_place_ids)]['categoryId']
            category_counts = visited_categories.value_counts()
            total_preferences = category_counts.sum()
            if total_preferences > 0:
                user_categories = category_counts / total_preferences
            else:
                user_categories = pd.Series(dtype=float)
            for _, place in self.places_df.iterrows():
                category_match = user_categories.get(place['categoryId'], 0)
                category_popularity_score = category_popularity.get(place['categoryId'], 0)
                distance = self.calculate_distance(
                    place['latitude'], place['longitude'],
                    self._center_lat, self._center_lon
                )
                normalized_distance = self.normalize_distance(distance)
                features = {
                    'user_id': user_id,
                    'place_id': place['id'],
                    'category_match': category_match,
                    'visit_count': place['visit_count'] / max_visits,
                    'distance_to_center': distance,
                    'category_popularity': category_popularity_score,
                    'normalized_distance': normalized_distance,
                    'is_visited': 1 if place['id'] in visited_place_ids.values else 0
                }
                user_features.append(features)
        return pd.DataFrame(user_features)

    def prepare_training_data(self):
        features_df = self.create_features()
        X = features_df[self.feature_names]
        y = features_df['is_visited']
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        X_train_scaled = pd.DataFrame(
            self.scaler.fit_transform(X_train),
            columns=self.feature_names
        )
        X_test_scaled = pd.DataFrame(
            self.scaler.transform(X_test),
            columns=self.feature_names
        )
        return X_train_scaled, X_test_scaled, y_train, y_test

    def build_model(self, input_dim):
        model = Sequential([
            Dense(64, input_shape=(input_dim,)),
            BatchNormalization(),
            Dense(32, activation='relu'),
            BatchNormalization(),
            Dropout(0.2),
            Dense(16, activation='relu'),
            BatchNormalization(),
            Dense(1, activation='sigmoid')
        ])
        model.compile(
            optimizer=Adam(learning_rate=0.001),
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        return model

    def train(self, epochs=30, batch_size=32):
        X_train, X_test, y_train, y_test = self.prepare_training_data()
        self.model = self.build_model(input_dim=len(self.feature_names))
        neg_class_count = len(y_train) - sum(y_train)
        pos_class_count = sum(y_train)
        total = neg_class_count + pos_class_count
        class_weights = {
            0: total / (2.0 * neg_class_count),
            1: total / (2.0 * pos_class_count)
        }
        self.model.fit(
            X_train, y_train,
            epochs=epochs,
            batch_size=batch_size,
            validation_data=(X_test, y_test),
            class_weight=class_weights,
            verbose=1
        )

    def save_model(self, filename='istanbul_ml_model.keras'):
        self.model.save(filename)
        joblib.dump(self.scaler, 'scaler.joblib')
        joblib.dump(self.feature_names, 'feature_names.joblib')

    @classmethod
    def load_model(cls, model_path='istanbul_ml_model.keras', scaler_path='scaler.joblib', feature_names_path='feature_names.joblib'):
        import tensorflow as tf
        instance = cls()
        instance.model = tf.keras.models.load_model(model_path)
        instance.scaler = joblib.load(scaler_path)
        instance.feature_names = joblib.load(feature_names_path)
        return instance

    def _get_user_preferences(self, user_id):
        user_visits = self.visited_df[self.visited_df['userId'] == user_id]
        if user_visits.empty:
            return pd.Series()
        visited_place_ids = user_visits['placeId']
        visited_categories = self.places_df[self.places_df['id'].isin(visited_place_ids)]['categoryId']
        category_counts = visited_categories.value_counts()
        category_weights = category_counts / category_counts.sum()
        return category_weights

    def recommend(self, user_id, user_lat=None, user_lon=None, top_n=5):
        if self.places_df is None:
            self.load_data_from_db()
        visited_places = set(self.visited_df[
            self.visited_df['userId'] == user_id
        ]['placeId'].values)
        scores = self.calculate_scores(user_id, user_lat, user_lon)
        unvisited_mask = ~self.places_df['id'].isin(visited_places)
        recommendations = []
        for i, (score, unvisited) in enumerate(zip(scores, unvisited_mask)):
            if unvisited:
                place = self.places_df.iloc[i]
                recommendations.append({
                    'place_id': place['id'],
                    'name': place['name'],
                    'category': place['category_name'],
                    'distance': self.calculate_distance(
                        place['latitude'], 
                        place['longitude'],
                        user_lat if user_lat else self._center_lat,
                        user_lon if user_lon else self._center_lon
                    ),
                    'score': float(score)
                })
        return sorted(recommendations, key=lambda x: x['score'], reverse=True)[:top_n]

    def calculate_scores(self, user_id, user_lat=None, user_lon=None):
        user_preferences = self._get_user_preferences(user_id)
        category_scores = np.zeros(len(self.places_df))
        if not user_preferences.empty:
            for cat_id, weight in user_preferences.items():
                if cat_id in self.category_matrix.columns:
                    category_scores += self.category_matrix[cat_id].values * weight
        if user_lat is not None and user_lon is not None:
            distances = np.array([
                self.calculate_distance(user_lat, user_lon, place['latitude'], place['longitude'])
                for _, place in self.places_df.iterrows()
            ])
            distance_scores = 1 / (1 + distances)
        else:
            default_lat, default_lon = 41.0082, 28.9784
            distances = np.array([
                self.calculate_distance(default_lat, default_lon, place['latitude'], place['longitude'])
                for _, place in self.places_df.iterrows()
            ])
            distance_scores = 1 / (1 + distances)
        popularity_scores = self.places_df['normalized_visits'].values
        final_scores = (
            0.65 * category_scores +
            0.3 * distance_scores +
            0.05 * popularity_scores
        )
        return final_scores

    def get_recommendations_for_new_user(self, user_lat, user_lon, top_n=5):
        if self.places_df is None:
            self.load_data_from_db()
        scores = []
        for _, place in self.places_df.iterrows():
            distance = self.calculate_distance(
                place['latitude'], place['longitude'], user_lat, user_lon
            )
            distance_score = self.normalize_distance(distance)
            popularity_score = place['normalized_visits']
            category_popularity = self._category_popularity.get(place['categoryId'], 0)
            final_score = (
                0.5 * distance_score +
                0.3 * popularity_score +
                0.2 * category_popularity
            )
            scores.append({
                'place_id': place['id'],
                'name': place['name'],
                'category': place['category_name'],
                'distance': distance,
                'score': final_score
            })
        return sorted(scores, key=lambda x: x['score'], reverse=True)[:top_n]

    def read_last_id(self, filename):
        if os.path.exists(filename):
            with open(filename, 'r') as f:
                return int(f.read().strip())
        return 0

    def write_last_id(self, filename, value):
        with open(filename, 'w') as f:
            f.write(str(value))
            
    def evaluate(self):
        X_train, X_test, y_train, y_test = self.prepare_training_data()
        y_pred = (self.model.predict(X_test) > 0.5).astype(int)
        precision = precision_score(y_test, y_pred)
        recall = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        print(f"Precision: {precision:.4f}")
        print(f"Recall:    {recall:.4f}")
        print(f"F1 Score:  {f1:.4f}")
        return precision, recall, f1
    
    def should_update_model(self):
        if self.db_connection is None:
            self.connect_to_database()
        
        try:
            cursor = self.db_connection.cursor(dictionary=True)
            
            # Veritabanından güncel max id'leri çek
            cursor.execute("SELECT MAX(id) as max_id FROM users")
            max_user_id = cursor.fetchone()['max_id'] or 0
            
            cursor.execute("SELECT MAX(id) as max_id FROM places")
            max_place_id = cursor.fetchone()['max_id'] or 0
            
            cursor.execute("SELECT MAX(id) as max_id FROM visited_places")
            max_visit_id = cursor.fetchone()['max_id'] or 0
            
            cursor.close()
            
            # ID'lerin farkını al
            new_users = max_user_id - self.last_user_id
            new_places = max_place_id - self.last_place_id
            new_interactions = max_visit_id - self.last_visit_id
            
            logging.info(f"Model güncelleme kontrolü: users={new_users}, places={new_places}, interactions={new_interactions}")
            
            return (new_users >= 1 or new_places >= 5 or new_interactions >= 100)
        
        except Exception as e:
            logging.error(f"should_update_model hatası: {str(e)}")
            return False

    def update_model_if_needed(self):
        if self.should_update_model():
            try:
                # Veritabanından en son ID'leri al
                if self.db_connection is None:
                    self.connect_to_database()
                cursor = self.db_connection.cursor(dictionary=True)
                
                cursor.execute("SELECT MAX(id) as max_id FROM users")
                max_user_id = cursor.fetchone()['max_id'] or 0
                
                cursor.execute("SELECT MAX(id) as max_id FROM places")
                max_place_id = cursor.fetchone()['max_id'] or 0
                
                cursor.execute("SELECT MAX(id) as max_id FROM visited_places")
                max_visit_id = cursor.fetchone()['max_id'] or 0
                
                cursor.close()
                
                # Modeli eğit
                logging.info(f"[{datetime.now()}] Model güncelleme başladı...")
                self.load_data_from_db()
                self.train()
                self.save_model()
                
                # Güncel id'leri dosyaya yaz
                self.write_last_id('last_user_id.txt', max_user_id)
                self.write_last_id('last_place_id.txt', max_place_id)
                self.write_last_id('last_visit_id.txt', max_visit_id)
                
                # Referans ID'leri de güncelle (model_metadata tablosu)
                self.update_reference_ids()
                
                # last_* değişkenlerini de RAM'de güncelle
                self.last_user_id = max_user_id
                self.last_place_id = max_place_id
                self.last_visit_id = max_visit_id
                
                logging.info(f"[{datetime.now()}] Model başarıyla güncellendi!")
                return True
            except Exception as e:
                logging.error(f"Model güncelleme hatası: {str(e)}")
                return False
        else:
            logging.info(f"[{datetime.now()}] Model güncelleme gerekmiyor.")
            return False