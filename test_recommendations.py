from ml_model import IstanbulMLRecommender

def test_recommendations():
    try:
        # Modeli yükle
        print("Model yükleniyor...")
        recommender = IstanbulMLRecommender.load_model()
        
        # Test için örnek bir kullanıcı ID'si
        test_user_id = 2
        
        # 1. Varsayılan merkez noktaya göre öneriler
        print("\n1. Varsayılan merkez noktaya göre öneriler (Sultanahmet):")
        recommendations = recommender.recommend(test_user_id, top_n=5)
        print_recommendations(recommendations)
        
        # 2. Kullanıcının konumuna göre öneriler (örnek: Taksim)
        print("\n2. Kullanıcının konumuna göre öneriler (Taksim):")
        taksim_lat = 41.0370
        taksim_lon = 28.9850
        recommendations = recommender.recommend(
            test_user_id, 
            user_lat=taksim_lat, 
            user_lon=taksim_lon, 
            top_n=5
        )
        print_recommendations(recommendations)
            
    except Exception as e:
        print(f"Hata oluştu: {str(e)}")
        print("\nModel dosyalarının doğru konumda olduğundan emin olun:")
        print("- istanbul_ml_model.h5")
        print("- scaler.joblib")
        print("- feature_names.joblib")

def print_recommendations(recommendations):
    print("\nÖnerilen Yerler:")
    print("-" * 80)
    for i, rec in enumerate(recommendations, 1):
        print(f"\n{i}. Öneri:")
        print(f"Yer Adı: {rec['name']}")
        print(f"Kategori: {rec['category']}")
        print(f"Mesafe: {rec['distance']:.2f} km")
        print(f"Öneri Skoru: {rec['score']:.4f}")
        print("-" * 80)

if __name__ == "__main__":
    test_recommendations() 