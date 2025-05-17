import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from ml_model import IstanbulMLRecommender
import tensorflow as tf
from datetime import datetime
import logging
import pandas as pd
from sklearn.metrics import roc_curve, auc, confusion_matrix, classification_report
from sklearn.preprocessing import label_binarize

def plot_training_history():
    # Model nesnesini oluştur
    recommender = IstanbulMLRecommender()
    
    # Verileri yükle
    recommender.load_data_from_db()
    
    # Eğitim verilerini hazırla
    X_train, X_test, y_train, y_test = recommender.prepare_training_data()
    
    # Modeli oluştur
    model = recommender.build_model(input_dim=len(recommender.feature_names))
    
    # Eğitim geçmişini kaydetmek için callback
    history_callback = tf.keras.callbacks.History()
    
    # Modeli eğit
    history = model.fit(
        X_train, y_train,
        epochs=30,
        batch_size=32,
        validation_data=(X_test, y_test),
        callbacks=[history_callback],
        verbose=1
    )
    
    # Grafik stilini ayarla
    plt.style.use('seaborn-v0_8')
    
    # Figure oluştur
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10))
    
    # Loss grafiği
    ax1.plot(history.history['loss'], label='Training Loss', color='#2ecc71', linewidth=2)
    ax1.plot(history.history['val_loss'], label='Validation Loss', color='#e74c3c', linewidth=2)
    ax1.set_title('Model Training and Validation Loss', fontsize=14, pad=20)
    ax1.set_xlabel('Epoch', fontsize=12)
    ax1.set_ylabel('Loss', fontsize=12)
    ax1.legend(fontsize=10)
    ax1.grid(True, linestyle='--', alpha=0.7)
    
    # Accuracy grafiği
    ax2.plot(history.history['accuracy'], label='Training Accuracy', color='#3498db', linewidth=2)
    ax2.plot(history.history['val_accuracy'], label='Validation Accuracy', color='#9b59b6', linewidth=2)
    ax2.set_title('Model Training and Validation Accuracy', fontsize=14, pad=20)
    ax2.set_xlabel('Epoch', fontsize=12)
    ax2.set_ylabel('Accuracy', fontsize=12)
    ax2.legend(fontsize=10)
    ax2.grid(True, linestyle='--', alpha=0.7)
    
    # Grafik düzenini ayarla
    plt.tight_layout()
    
    # Grafiği kaydet
    plt.savefig('training_history.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    return history

def plot_feature_importance():
    # Model nesnesini oluştur
    recommender = IstanbulMLRecommender()
    
    # Verileri yükle
    recommender.load_data_from_db()
    
    # Eğitim verilerini hazırla
    X_train, X_test, y_train, y_test = recommender.prepare_training_data()
    
    # Modeli oluştur ve eğit
    model = recommender.build_model(input_dim=len(recommender.feature_names))
    model.fit(X_train, y_train, epochs=30, batch_size=32, validation_data=(X_test, y_test), verbose=0)
    
    # Ağırlıkları al
    weights = model.layers[0].get_weights()[0]
    
    # Özellik önemlerini hesapla (mutlak değerlerin ortalaması)
    feature_importance = np.abs(weights).mean(axis=1)
    
    # Özellik isimlerini al
    feature_names = recommender.feature_names
    
    # Grafik stilini ayarla
    plt.style.use('seaborn-v0_8')
    
    # Figure oluştur
    plt.figure(figsize=(12, 6))
    
    # Çubuk grafiği oluştur
    bars = plt.bar(feature_names, feature_importance, color='#3498db')
    
    # Grafik başlığı ve etiketleri
    plt.title('Feature Importance Chart', fontsize=14, pad=20)
    plt.xlabel('Features', fontsize=12)
    plt.ylabel('Importance Score', fontsize=12)
    
    # X ekseni etiketlerini döndür
    plt.xticks(rotation=45, ha='right')
    
    # Çubukların üzerine değerleri yaz
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height,
                f'{height:.3f}',
                ha='center', va='bottom')
    
    # Grafik düzenini ayarla
    plt.tight_layout()
    
    # Grafiği kaydet
    plt.savefig('feature_importance.png', dpi=300, bbox_inches='tight')
    plt.close()

def plot_category_distribution():
    # Model nesnesini oluştur
    recommender = IstanbulMLRecommender()
    
    # Verileri yükle
    recommender.load_data_from_db()
    
    # Kategori bazlı öneri sayılarını hesapla
    category_counts = recommender.places_df['category_name'].value_counts()
    
    # Grafik stilini ayarla
    plt.style.use('seaborn-v0_8')
    
    # Figure oluştur
    plt.figure(figsize=(12, 8))
    
    # Pasta grafiği oluştur
    plt.pie(category_counts.values, 
            labels=category_counts.index,
            autopct='%1.1f%%',
            startangle=90,
            shadow=True,
            explode=[0.05] * len(category_counts))  # Her dilimi biraz ayır
    
    # Grafik başlığı
    plt.title('Recommendation Distribution by Category', fontsize=14, pad=20)
    
    # Grafik düzenini ayarla
    plt.axis('equal')  # Daireyi tam yuvarlak yap
    
    # Grafiği kaydet
    plt.savefig('category_distribution.png', dpi=300, bbox_inches='tight')
    plt.close()

def plot_distance_recommendation_relationship():
    # Model nesnesini oluştur
    recommender = IstanbulMLRecommender()
    
    # Verileri yükle
    recommender.load_data_from_db()
    
    # Örnek bir kullanıcı için önerileri al
    test_user_id = 1  # Test için bir kullanıcı ID'si
    recommendations = recommender.recommend(test_user_id, top_n=100)  # Daha fazla öneri al
    
    # Verileri DataFrame'e dönüştür
    df = pd.DataFrame(recommendations)
    
    # Grafik stilini ayarla
    plt.style.use('seaborn-v0_8')
    
    # Figure oluştur
    plt.figure(figsize=(12, 6))
    
    # Scatter plot oluştur
    scatter = plt.scatter(df['distance'], df['score'],
                         c=df['score'],  # Renk skalası için score kullan
                         cmap='viridis',
                         alpha=0.6,
                         s=100)  # Nokta boyutu
    
    # Renk çubuğu ekle
    plt.colorbar(scatter, label='Recommendation Score')
    
    # Grafik başlığı ve etiketleri
    plt.title('Distance-Recommendation Score Relationship', fontsize=14, pad=20)
    plt.xlabel('Distance (km)', fontsize=12)
    plt.ylabel('Recommendation Score', fontsize=12)
    
    # Trend çizgisi ekle
    z = np.polyfit(df['distance'], df['score'], 1)
    p = np.poly1d(z)
    plt.plot(df['distance'], p(df['distance']), "r--", alpha=0.8)
    
    # Grafik düzenini ayarla
    plt.tight_layout()
    
    # Grafiği kaydet
    plt.savefig('distance_recommendation.png', dpi=300, bbox_inches='tight')
    plt.close()

def plot_user_visit_analysis():
    # Model nesnesini oluştur
    recommender = IstanbulMLRecommender()
    
    # Verileri yükle
    recommender.load_data_from_db()
    
    # Ziyaret verilerini tarih bazlı grupla
    visited_df = recommender.visited_df
    visited_df['visit_date'] = pd.to_datetime(visited_df['scanDate'], errors='coerce')
    daily_visits = visited_df.groupby(visited_df['visit_date'].dt.date).size()
    
    # Grafik stilini ayarla
    plt.style.use('seaborn-v0_8')
    
    # Figure oluştur
    plt.figure(figsize=(15, 6))
    
    # Çizgi grafiği oluştur
    plt.plot(daily_visits.index, daily_visits.values,
             marker='o',
             linestyle='-',
             color='#2ecc71',
             linewidth=2,
             markersize=6)
    
    # Grafik başlığı ve etiketleri
    plt.title('Daily User Visit Analysis', fontsize=14, pad=20)
    plt.xlabel('Date', fontsize=12)
    plt.ylabel('Number of Visits', fontsize=12)
    
    # X ekseni tarihlerini döndür
    plt.xticks(rotation=45)
    
    # Grid ekle
    plt.grid(True, linestyle='--', alpha=0.7)
    
    # Grafik düzenini ayarla
    plt.tight_layout()
    
    # Grafiği kaydet
    plt.savefig('user_visits.png', dpi=300, bbox_inches='tight')
    plt.close()

def plot_metrics_table():
    # Model nesnesini oluştur
    recommender = IstanbulMLRecommender()
    
    # Verileri yükle ve modeli eğit
    recommender.load_data_from_db()
    recommender.train()
    
    # Metrikleri al
    precision, recall, f1 = recommender.evaluate()
    
    # Grafik stilini ayarla
    plt.style.use('seaborn-v0_8')
    
    # Figure oluştur
    fig, ax = plt.subplots(figsize=(10, 4))
    
    # Tablo verilerini hazırla
    metrics = ['Precision', 'Recall', 'F1 Score']
    values = [precision, recall, f1]
    colors = ['#2ecc71', '#3498db', '#e74c3c']
    
    # Tablo oluştur
    table = ax.table(
        cellText=[[f'{val:.4f}'] for val in values],
        rowLabels=metrics,
        colLabels=['Value'],
        cellLoc='center',
        loc='center',
        colWidths=[0.3]
    )
    
    # Tablo stilini ayarla
    table.auto_set_font_size(False)
    table.set_fontsize(12)
    table.scale(1.2, 2)
    
    # Hücre renklerini ayarla
    for i, color in enumerate(colors):
        table[(i+1, 0)].set_facecolor(color)
        table[(i+1, 0)].set_text_props(color='white')
    
    # Başlık hücresini ayarla
    table[(0, 0)].set_facecolor('#34495e')
    table[(0, 0)].set_text_props(color='white')
    
    # Eksenleri gizle
    ax.axis('off')
    
    # Başlık ekle
    plt.title('Model Performance Metrics', fontsize=14, pad=20)
    
    # Grafiği kaydet
    plt.savefig('metrics_table.png', dpi=300, bbox_inches='tight')
    plt.close()

def plot_roc_curve():
    # Model nesnesini oluştur
    recommender = IstanbulMLRecommender()
    
    # Verileri yükle ve modeli eğit
    recommender.load_data_from_db()
    recommender.train()
    
    # Test verilerini hazırla
    X_train, X_test, y_train, y_test = recommender.prepare_training_data()
    
    # Model tahminlerini al
    y_pred_proba = recommender.model.predict(X_test)
    
    # ROC eğrisi için gerekli değerleri hesapla
    fpr, tpr, _ = roc_curve(y_test, y_pred_proba)
    roc_auc = auc(fpr, tpr)
    
    # Grafik stilini ayarla
    plt.style.use('seaborn-v0_8')
    
    # Figure oluştur
    plt.figure(figsize=(10, 8))
    
    # ROC eğrisini çiz
    plt.plot(fpr, tpr, color='#2ecc71', lw=2,
             label=f'ROC Curve (AUC = {roc_auc:.3f})')
    
    # Rastgele tahmin çizgisi
    plt.plot([0, 1], [0, 1], color='#e74c3c', linestyle='--', lw=2,
             label='Random Prediction')
    
    # Grafik özelliklerini ayarla
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate', fontsize=12)
    plt.ylabel('True Positive Rate', fontsize=12)
    plt.title('ROC Curve', fontsize=14, pad=20)
    plt.legend(loc="lower right", fontsize=10)
    plt.grid(True, linestyle='--', alpha=0.7)
    
    # Grafiği kaydet
    plt.savefig('roc_curve.png', dpi=300, bbox_inches='tight')
    plt.close()

def plot_confusion_matrix():
    # Model nesnesini oluştur
    recommender = IstanbulMLRecommender()
    
    # Verileri yükle ve modeli eğit
    recommender.load_data_from_db()
    recommender.train()
    
    # Test verilerini hazırla
    X_train, X_test, y_train, y_test = recommender.prepare_training_data()
    
    # Model tahminlerini al
    y_pred = (recommender.model.predict(X_test) > 0.5).astype(int)
    
    # Karmaşıklık matrisini hesapla
    cm = confusion_matrix(y_test, y_pred)
    
    # Grafik stilini ayarla
    plt.style.use('seaborn-v0_8')
    
    # Figure oluştur
    plt.figure(figsize=(10, 8))
    
    # Isı haritası oluştur
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=['Negative', 'Positive'],
                yticklabels=['Negative', 'Positive'])
    
    # Grafik özelliklerini ayarla
    plt.xlabel('Predicted Class', fontsize=12)
    plt.ylabel('True Class', fontsize=12)
    plt.title('Confusion Matrix', fontsize=14, pad=20)
    
    # Grafiği kaydet
    plt.savefig('confusion_matrix.png', dpi=300, bbox_inches='tight')
    plt.close()

def plot_overall_performance_metrics():
    # Model nesnesini oluştur
    recommender = IstanbulMLRecommender()
    
    # Verileri yükle ve modeli eğit
    recommender.load_data_from_db()
    recommender.train()
    
    # Test verilerini hazırla
    X_train, X_test, y_train, y_test = recommender.prepare_training_data()
    
    # Model tahminlerini al
    y_pred = (recommender.model.predict(X_test) > 0.5).astype(int)
    
    # Sınıflandırma raporunu al
    report = classification_report(y_test, y_pred, output_dict=True)
    
    # Metrikleri DataFrame'e dönüştür
    metrics_df = pd.DataFrame(report).transpose()
    metrics_df = metrics_df.drop('support', axis=1)  # support sütununu kaldır
    
    # Grafik stilini ayarla
    plt.style.use('seaborn-v0_8')
    
    # Figure oluştur
    fig, ax = plt.subplots(figsize=(8, 6))
    
    # Heatmap - Tüm metrikler
    sns.heatmap(metrics_df, annot=True, fmt='.3f', cmap='YlOrRd', ax=ax)
    ax.set_title('Overall Performance Metrics', fontsize=14, pad=20)
    
    plt.tight_layout()
    plt.savefig('overall_performance.png', dpi=300, bbox_inches='tight')
    plt.close()

if __name__ == "__main__":
    # Logging ayarları
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )
    
    try:
        logging.info("Eğitim performans grafiği oluşturuluyor...")
        plot_training_history()
        logging.info("Grafik başarıyla oluşturuldu: training_history.png")
    except Exception as e:
        logging.error(f"Grafik oluşturulurken hata oluştu: {str(e)}")

    try:
        logging.info("Özellik önem grafiği oluşturuluyor...")
        plot_feature_importance()
        logging.info("Grafik başarıyla oluşturuldu: feature_importance.png")
    except Exception as e:
        logging.error(f"Grafik oluşturulurken hata oluştu: {str(e)}")

    try:
        logging.info("Kategori dağılım grafiği oluşturuluyor...")
        plot_category_distribution()
        logging.info("Grafik başarıyla oluşturuldu: category_distribution.png")
    except Exception as e:
        logging.error(f"Grafik oluşturulurken hata oluştu: {str(e)}")

    try:
        logging.info("Mesafe-öneri ilişki grafiği oluşturuluyor...")
        plot_distance_recommendation_relationship()
        logging.info("Grafik başarıyla oluşturuldu: distance_recommendation.png")
    except Exception as e:
        logging.error(f"Grafik oluşturulurken hata oluştu: {str(e)}")

    try:
        logging.info("Kullanıcı ziyaret analizi grafiği oluşturuluyor...")
        plot_user_visit_analysis()
        logging.info("Grafik başarıyla oluşturuldu: user_visits.png")
    except Exception as e:
        logging.error(f"Grafik oluşturulurken hata oluştu: {str(e)}")

    try:
        logging.info("ROC eğrisi oluşturuluyor...")
        plot_roc_curve()
        logging.info("Grafik başarıyla oluşturuldu: roc_curve.png")
    except Exception as e:
        logging.error(f"Grafik oluşturulurken hata oluştu: {str(e)}")

    try:
        logging.info("Karmaşıklık matrisi oluşturuluyor...")
        plot_confusion_matrix()
        logging.info("Grafik başarıyla oluşturuldu: confusion_matrix.png")
    except Exception as e:
        logging.error(f"Grafik oluşturulurken hata oluştu: {str(e)}")

    try:
        logging.info("Genel performans metrikleri grafiği oluşturuluyor...")
        plot_overall_performance_metrics()
        logging.info("Grafik başarıyla oluşturuldu: overall_performance.png")
    except Exception as e:
        logging.error(f"Grafik oluşturulurken hata oluştu: {str(e)}") 

        