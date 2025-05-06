from ml_model import IstanbulMLRecommender

# Eğitilmiş modeli yükle
recommender = IstanbulMLRecommender.load_model(
    model_path='istanbul_ml_model.h5',
    scaler_path='scaler.joblib',
    feature_names_path='feature_names.joblib'
)

# Güncel veritabanı verilerini çek (kullanıcı ve mekanlar için)
recommender.load_data_from_db()

# Kullanıcı 1 için öneri alalım (örnek konum: Sultanahmet)
user_id = 3
user_lat = 41.0082
user_lon = 28.9784

recommendations = recommender.recommend(user_id, user_lat, user_lon, top_n=15)

print('Eğitilmiş model ile Kullanıcı 1 için öneriler:')
for rec in recommendations:
    print(f"{rec['name']} (Kategori: {rec['category']}, Mesafe: {rec['distance']:.2f} km, Skor: {rec['score']:.4f})")