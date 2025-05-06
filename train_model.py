import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics.pairwise import haversine_distances
from sklearn.model_selection import train_test_split
import joblib
from math import radians
from ml_model import IstanbulMLRecommender
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import Adam

class IstanbulGuideRecommender:
    def __init__(self):
        self.places_df = None
        self.location_model = None
        self.category_matrix = None
        self.location_scaler = StandardScaler()
        self.popularity_scaler = MinMaxScaler()
        
    def prepare_data(self):
        # Verileri yükle
        self.places_df = pd.read_csv('places_with_metrics.csv')
        hobbies_df = pd.read_csv('hobbies.csv')
        visited_df = pd.read_csv('visited_places.csv')
        
        # Konum verilerini hazırla
        self.places_df['latitude_rad'] = self.places_df['latitude'].apply(radians)
        self.places_df['longitude_rad'] = self.places_df['longitude'].apply(radians)
        
        # Kategori matrisini oluştur (One-hot encoding)
        self.category_matrix = pd.get_dummies(self.places_df['categoryId'])
        
        # Ziyaret sayılarını normalize et
        visit_counts = self.places_df['visit_count'].values.reshape(-1, 1)
        self.places_df['normalized_visits'] = self.popularity_scaler.fit_transform(visit_counts)
        
        return self.places_df
    
    def train_location_model(self, n_neighbors=5):
        # Konum verilerini hazırla
        location_features = self.places_df[['latitude_rad', 'longitude_rad']].values
        
        # KNN modelini eğit
        self.location_model = NearestNeighbors(
            n_neighbors=n_neighbors, 
            metric='haversine',
            algorithm='ball_tree'
        )
        self.location_model.fit(location_features)
        
        return self.location_model
    
    def get_user_preferences(self, user_id, hobbies_df):
        # Kullanıcının kategori tercihlerini hesapla
        user_categories = hobbies_df[hobbies_df['userId'] == user_id]['categoryId'].value_counts()
        category_weights = user_categories / user_categories.sum()
        return category_weights
    
    def calculate_scores(self, user_location, user_preferences, radius_km=5):
        # Kullanıcı konumuna yakın yerleri bul
        user_loc_rad = np.array([[radians(user_location[0]), radians(user_location[1])]])
        
        # Tüm mekanlar için mesafeleri hesapla
        place_coords = self.places_df[['latitude_rad', 'longitude_rad']].values
        distances = haversine_distances(user_loc_rad, place_coords)[0] * 6371  # 6371 km (Dünya'nın yarıçapı)
        
        # Mesafe skorunu hesapla (0-1 arası)
        distance_scores = 1 / (1 + distances)
        
        # Kategori skorunu hesapla
        category_scores = np.zeros(len(self.places_df))
        for cat_id, weight in user_preferences.items():
            if cat_id in self.category_matrix.columns:
                category_scores += self.category_matrix[cat_id].values * weight
        
        # Popülerlik skorunu al
        popularity_scores = self.places_df['normalized_visits'].values
        
        # Final skorları hesapla
        final_scores = (
            0.4 * category_scores +
            0.3 * distance_scores +
            0.3 * popularity_scores
        )
        
        return final_scores, np.arange(len(self.places_df))
    
    def get_recommendations(self, user_id, user_location, visited_places=None, top_n=5):
        # Kullanıcı tercihlerini al
        hobbies_df = pd.read_csv('hobbies.csv')
        user_preferences = self.get_user_preferences(user_id, hobbies_df)
        
        # Skorları hesapla
        scores, indices = self.calculate_scores(user_location, user_preferences)
        
        # Ziyaret edilmemiş yerleri filtrele
        if visited_places is not None:
            mask = ~self.places_df['id'].isin(visited_places)
            scores = scores * mask
        
        # En iyi önerileri seç
        top_indices = np.argsort(scores)[-top_n:][::-1]
        recommendations = self.places_df.iloc[top_indices]
        
        return recommendations[['id', 'name', 'category_name', 'latitude', 'longitude', 'visit_count']]
    
    def save_model(self, filename='istanbul_guide_model.joblib'):
        # Modeli kaydet
        model_data = {
            'location_model': self.location_model,
            'category_matrix': self.category_matrix,
            'location_scaler': self.location_scaler,
            'popularity_scaler': self.popularity_scaler,
            'places_df': self.places_df
        }
        joblib.dump(model_data, filename)
    
    @classmethod
    def load_model(cls, filename='istanbul_guide_model.joblib'):
        # Kaydedilmiş modeli yükle
        model = cls()
        model_data = joblib.load(filename)
        model.location_model = model_data['location_model']
        model.category_matrix = model_data['category_matrix']
        model.location_scaler = model_data['location_scaler']
        model.popularity_scaler = model_data['popularity_scaler']
        model.places_df = model_data['places_df']
        return model

def train_and_save_model():
    print("Model eğitimi başlıyor...")
    
    # Veri setlerini yükle
    print("Veriler yükleniyor...")
    places_df = pd.read_csv('places_with_metrics.csv')
    hobbies_df = pd.read_csv('hobbies.csv')
    visited_df = pd.read_csv('visited_places.csv')
    
    print(f"Toplam mekan sayısı: {len(places_df)}")
    print(f"Toplam hobi sayısı: {len(hobbies_df)}")
    print(f"Toplam ziyaret sayısı: {len(visited_df)}")
    
    # Model nesnesini oluştur
    recommender = IstanbulMLRecommender()
    
    # Verileri yükle ve hazırla
    recommender.load_data()
    
    # Eğitim verisi oluştur
    X_train, X_test, y_train, y_test = recommender.prepare_training_data()
    
    # Modeli eğit
    print("\nModel eğitiliyor...")
    history = recommender.train(epochs=30, batch_size=32)
    
    # Modeli değerlendir
    print("\nModel değerlendiriliyor...")
    metrics = recommender.evaluate()
    print(f"Precision: {metrics['precision']:.4f}")
    print(f"Recall: {metrics['recall']:.4f}")
    print(f"F1 Score: {metrics['f1_score']:.4f}")
    
    # Modeli kaydet
    print("\nModel kaydediliyor...")
    recommender.save_model()
    
    return recommender

def test_model():
    print("\nModel test ediliyor...")
    
    # Test parametreleri
    test_user_id = 2  # Test için user_id 2'yi kullanalım
    test_locations = {
        "Sultanahmet": (41.0082, 28.9784),
        "Taksim": (41.0370, 28.9850)
    }
    
    # Modeli yükle
    recommender = IstanbulMLRecommender.load_model()
    
    for location_name, (lat, lon) in test_locations.items():
        print(f"\n{location_name} bölgesi için öneriler:")
        print("-" * 50)
        
        recommendations = recommender.recommend(
            user_id=test_user_id,
            user_lat=lat,
            user_lon=lon,
            top_n=5
        )
        
        for i, rec in enumerate(recommendations, 1):
            print(f"\n{i}. Öneri:")
            print(f"Mekan: {rec['name']}")
            print(f"Kategori: {rec['category']}")
            print(f"Mesafe: {rec['distance']:.2f} km")
            print(f"Skor: {rec['score']:.4f}")

if __name__ == "__main__":
    # Modeli eğit ve kaydet
    recommender = train_and_save_model()
    
    # Test et
    test_model() 