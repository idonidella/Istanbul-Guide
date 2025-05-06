from ml_model import IstanbulMLRecommender

# Modeli yükle (veya eğitilmişse doğrudan yükle)
recommender = IstanbulMLRecommender()
recommender.load_data_from_db()  # Veritabanından güncel verileri çek

# Eğer modeli yeni eğittiyseniz:
# recommender.train()
# recommender.save_model()

# Kullanıcı 1 için öneri al
user_id = 7
user_lat = 41.0082   # Kullanıcı konumu (örnek: Sultanahmet)
user_lon = 28.9784

recommendations = recommender.recommend(user_id, user_lat, user_lon, top_n=10)

print("Kullanıcı 1 için öneriler:")
for rec in recommendations:
    print(f"{rec['name']} (Kategori: {rec['category']}, Mesafe: {rec['distance']:.2f} km, Skor: {rec['score']:.4f})")