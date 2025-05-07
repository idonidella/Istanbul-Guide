from ml_model import IstanbulMLRecommender

recommender = IstanbulMLRecommender()
recommender.load_data_from_db()   # Veritabanından verileri çek
recommender.train()
recommender.save_model()          # Eğitilen modeli kaydet

print("Model başarıyla eğitildi ve kaydedildi.")