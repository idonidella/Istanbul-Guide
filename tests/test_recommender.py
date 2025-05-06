import unittest
import pandas as pd
import numpy as np
import sys
import os
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import NMF
import tensorflow as tf
from sklearn.ensemble import RandomForestClassifier

# Ana dizini Python yoluna ekle
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from train_model import IstanbulGuideRecommender

class TestIstanbulGuideRecommender(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Test başlamadan önce çalışacak setup"""
        cls.recommender = IstanbulGuideRecommender()
        cls.recommender.prepare_data()
        cls.recommender.train_location_model()
    
    def test_data_loading(self):
        """Veri yükleme testleri"""
        self.assertIsNotNone(self.recommender.places_df)
        self.assertGreater(len(self.recommender.places_df), 0)
        self.assertTrue('latitude_rad' in self.recommender.places_df.columns)
        self.assertTrue('longitude_rad' in self.recommender.places_df.columns)
    
    def test_distance_calculation(self):
        """Mesafe hesaplama testleri"""
        # Sultanahmet koordinatları
        test_location = (41.0082, 28.9784)
        scores, indices = self.recommender.calculate_scores(
            test_location,
            {2: 1.0}  # Test için basit bir kategori tercihi
        )
        self.assertEqual(len(scores), len(self.recommender.places_df))
        self.assertTrue(all(0 <= score <= 1 for score in scores))
    
    def test_recommendations(self):
        """Öneri sistemi testleri"""
        test_user_id = 1
        test_location = (41.0082, 28.9784)
        recommendations = self.recommender.get_recommendations(
            user_id=test_user_id,
            user_location=test_location,
            top_n=5
        )
        self.assertEqual(len(recommendations), 5)
        self.assertTrue(all(col in recommendations.columns 
                          for col in ['id', 'name', 'category_name']))
    
    def test_visited_places_filter(self):
        """Ziyaret edilmiş yer filtreleme testi"""
        test_user_id = 1
        test_location = (41.0082, 28.9784)
        visited_places = [1, 2, 3]  # Test için bazı ziyaret edilmiş yerler
        
        recommendations = self.recommender.get_recommendations(
            user_id=test_user_id,
            user_location=test_location,
            visited_places=visited_places
        )
        
        # Önerilerde ziyaret edilmiş yerler olmamalı
        self.assertTrue(all(place_id not in visited_places 
                          for place_id in recommendations['id']))
    
    def test_category_weights(self):
        """Kategori ağırlıkları testi"""
        test_user_id = 1
        hobbies_df = pd.read_csv('hobbies.csv')
        weights = self.recommender.get_user_preferences(test_user_id, hobbies_df)
        
        self.assertTrue(all(0 <= w <= 1 for w in weights.values))
        self.assertAlmostEqual(sum(weights.values), 1.0, places=5)
    
    def test_model_persistence(self):
        """Model kaydetme ve yükleme testi"""
        # Modeli kaydet
        self.recommender.save_model('test_model.joblib')
        
        # Yeni bir model yükle
        loaded_model = IstanbulGuideRecommender.load_model('test_model.joblib')
        
        # Yüklenen modelin aynı özelliklere sahip olduğunu kontrol et
        self.assertEqual(
            len(self.recommender.places_df),
            len(loaded_model.places_df)
        )
        self.assertEqual(
            self.recommender.category_matrix.shape,
            loaded_model.category_matrix.shape
        )

    def test_collaborative_model(self):
        """Collaborative Filtering modeli testi"""
        user_similarity = self.recommender.train_collaborative_model()
        self.assertIsNotNone(user_similarity)
        self.assertEqual(user_similarity.shape, (len(self.recommender.places_df), len(self.recommender.places_df)))

    def test_matrix_factorization(self):
        """Matrix Factorization modeli testi"""
        user_features, place_features = self.recommender.train_matrix_factorization()
        self.assertIsNotNone(user_features)
        self.assertIsNotNone(place_features)
        self.assertEqual(user_features.shape, (len(self.recommender.places_df), 20))
        self.assertEqual(place_features.shape, (20, len(self.recommender.places_df)))

    def test_deep_model(self):
        """Deep Learning modeli testi"""
        model = self.recommender.build_deep_model()
        self.assertIsNotNone(model)
        self.assertEqual(model.layers[0].input_shape, (None, input_dim))
        self.assertEqual(model.layers[-1].output_shape, (None, 1))

    def test_feature_engineering(self):
        """Feature Engineering testi"""
        user_id = 1
        place_id = 1
        user_location = (41.0082, 28.9784)
        features = self.recommender.create_feature_vector(user_id, place_id, user_location)
        self.assertIsNotNone(features)
        self.assertTrue('distance' in features)
        self.assertTrue('category_score' in features)
        self.assertTrue('popularity' in features)
        self.assertTrue('time_of_day' in features)
        self.assertTrue('day_of_week' in features)
        self.assertTrue('user_visit_frequency' in features)
        self.assertTrue('place_visit_frequency' in features)

    def test_ml_model(self):
        """Machine Learning modeli testi"""
        model = self.recommender.train_ml_model()
        self.assertIsNotNone(model)
        self.assertEqual(model.n_estimators, 100)

if __name__ == '__main__':
    unittest.main() 