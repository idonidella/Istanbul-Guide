from flask import Flask, request, jsonify
from flask_cors import CORS
from ml_model import IstanbulMLRecommender
import os
import sys
import threading
import time
from dotenv import load_dotenv
from flask_swagger_ui import get_swaggerui_blueprint
import numpy as np
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import logging

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Swagger configuration
SWAGGER_URL = '/api/docs'
API_URL = '/static/swagger.json'

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "Istanbul Guide API"
    }
)

app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

# Initialize the recommender
recommender = None

def restart_app():
    """
    Uygulamayı yeniden başlatır - 1 saniye bekletmeli ki API yanıt verebilsin
    """
    time.sleep(1)  # API yanıt versin diye biraz bekle
    logging.info(f"[{datetime.now()}] API yeniden başlatılıyor...")
    os.execv(sys.executable, [sys.executable] + sys.argv)

def init_recommender():
    global recommender
    try:
        # Model dosyası var mı kontrol et
        if os.path.exists('istanbul_ml_model.keras'):
            recommender = IstanbulMLRecommender.load_model(
                model_path='istanbul_ml_model.keras',
                scaler_path='scaler.joblib',
                feature_names_path='feature_names.joblib'
            )
        else:
            # Model dosyası yoksa yeni bir model oluştur
            recommender = IstanbulMLRecommender()
            recommender.load_data_from_db()
            recommender.train()
            recommender.save_model()
            
        # Veritabanı bağlantısı ve referans değerlerini yükle
        recommender.load_data_from_db()
        logging.info("Model başarıyla yüklendi!")
    except Exception as e:
        logging.error(f"Model yüklenirken hata oluştu: {str(e)}")
        # Basic bir model oluştur, eğitilmemiş olsa bile API çalışabilsin
        recommender = IstanbulMLRecommender()

def convert_numpy(obj):
    if isinstance(obj, np.integer):
        return int(obj)
    if isinstance(obj, np.floating):
        return float(obj)
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    return obj

@app.route('/health', methods=['GET'])
def health_check():
    """
    API sağlık durumu kontrolü
    """
    return jsonify({
        'status': 'healthy',
        'model_loaded': recommender is not None,
        'version': '1.0.0'
    })

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        # İstek loglaması
        logging.info(f"[{datetime.now()}] Öneri isteği alındı - Request Body: {request.get_json()}")
        
        data = request.get_json()
        user_id = data.get('userId')
        user_lat = data.get('latitude')
        user_lon = data.get('longitude')
        top_n = data.get('topN', 5)

        if user_id:
            recommendations = recommender.recommend(
                user_id=user_id,
                user_lat=user_lat,
                user_lon=user_lon,
                top_n=top_n
            )
        else:
            recommendations = recommender.get_recommendations_for_new_user(
                user_lat=user_lat,
                user_lon=user_lon,
                top_n=top_n
            )

        # NumPy değerlerini Python'un standart tiplerine dönüştür
        processed_recommendations = []
        for rec in recommendations:
            processed_rec = {k: convert_numpy(v) for k, v in rec.items()}
            processed_recommendations.append(processed_rec)

        # Yanıt loglaması
        logging.info(f"[{datetime.now()}] Öneri yanıtı gönderildi - Response: {processed_recommendations}")
        
        return jsonify({'recommendations': processed_recommendations})
    except Exception as e:
        # Hata loglaması
        logging.error(f"[{datetime.now()}] Öneri isteğinde hata oluştu: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/restart', methods=['POST'])
def restart_api():
    """
    API'yi yeniden başlatır - Mobil uygulamadan kullanıcı öneri istediğinde çağrılır
    """
    try:
        # İstek loglaması
        logging.info(f"[{datetime.now()}] Yeniden başlatma isteği alındı")
        
        # Asenkron olarak yeniden başlatma işlemini başlat
        thread = threading.Thread(target=restart_app)
        thread.daemon = True
        thread.start()
        
        # Yanıt loglaması
        logging.info(f"[{datetime.now()}] Yeniden başlatma yanıtı gönderildi")
        
        return jsonify({
            'status': 'success',
            'message': 'API yeniden başlatılıyor...'
        })
    except Exception as e:
        # Hata loglaması
        logging.error(f"[{datetime.now()}] Yeniden başlatma hatası: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

def test_scheduler():
    print("Scheduler çalışıyor...")

@app.route('/api/model/status', methods=['GET'])
def model_status():
    """
    Model durumunu kontrol et ve güncelleme gerekip gerekmediğini göster
    """
    try:
        needs_update = recommender.should_update_model()
        return jsonify({
            'status': 'success',
            'needs_update': needs_update,
            'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })
    except Exception as e:
        logging.error(f"Model durum kontrolü hatası: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/model/update', methods=['POST'])
def update_model():
    """
    Modeli manuel olarak güncelle
    """
    try:
        recommender.update_model_if_needed()
        return jsonify({
            'status': 'success',
            'message': 'Model güncelleme işlemi başlatıldı'
        })
    except Exception as e:
        logging.error(f"Model güncelleme hatası: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/model/check-update', methods=['POST'])
def check_and_update_model():
    """
    Yeni kullanıcı kaydı olduğunda modeli kontrol et ve gerekirse güncelle
    """
    try:
        # Önce modelin güncellenme ihtiyacını kontrol et
        needs_update = recommender.should_update_model()
        
        if needs_update:
            # Modeli güncelle
            updated = recommender.update_model_if_needed()
            
            # Güncelleme sonrası tekrar kontrol et
            needs_update_now = recommender.should_update_model()
            
            return jsonify({
                'status': 'success',
                'message': 'Model güncelleme işlemi tamamlandı' if updated else 'Model güncellenemedi',
                'updated': updated,
                'needs_update_now': needs_update_now  # Güncelleme sonrası durum
            })
        else:
            return jsonify({
                'status': 'success',
                'message': 'Model güncelleme gerekmiyor',
                'updated': False
            })
    except Exception as e:
        logging.error(f"Model kontrol hatası: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

def scheduled_update():
    """
    Zamanlanmış model güncelleme işlemi
    """
    try:
        recommender.update_model_if_needed()
        logging.info(f"[{datetime.now()}] Zamanlanmış model güncelleme kontrolü yapıldı")
    except Exception as e:
        logging.error(f"Zamanlanmış güncelleme hatası: {str(e)}")

if __name__ == '__main__':
    # Logging ayarları
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('app.log'),
            logging.StreamHandler()
        ]
    )
    
    # Model başlatma
    init_recommender()
    
    # OTOMATİK GÜNCELLEME (Scheduler ile)
    scheduler = BackgroundScheduler()
    # Her gece 23:59'da çalıştır
    scheduler.add_job(
        recommender.update_model_if_needed, 
        'cron', 
        hour=21, 
        minute=43
    )
    scheduler.start()
    
    # Uygulamayı başlat
    app.run(host='0.0.0.0', port=5001, debug=True) 