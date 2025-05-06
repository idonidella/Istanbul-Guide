import pandas as pd
import mysql.connector
from dotenv import load_dotenv
import os

# .env dosyasını yükle
load_dotenv()

# Veritabanı bağlantısı
db = mysql.connector.connect(
    host=os.getenv('DB_HOST', 'localhost'),
    user=os.getenv('DB_USER', 'root'),
    password=os.getenv('DB_PASSWORD', ''),
    database=os.getenv('DB_NAME', 'istanbul_guide')
)

# Places ve metrikleri export et
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
        p.id, 
        p.name, 
        p.description, 
        p.latitude, 
        p.longitude, 
        p.qrCode, 
        p.categoryId,
        c.name
"""
places_df = pd.read_sql(places_query, db)
places_df.to_csv('places_with_metrics.csv', index=False)

# Hobbies export et
hobbies_df = pd.read_sql("SELECT * FROM hobbies", db)
hobbies_df.to_csv('hobbies.csv', index=False)

# Visited places export et
visited_df = pd.read_sql("SELECT * FROM visited_places", db)
visited_df.to_csv('visited_places.csv', index=False)

print("Veriler başarıyla export edildi!") 