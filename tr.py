from ml_model import IstanbulMLRecommender
import matplotlib.pyplot as plt
import numpy as np

# Modeli yükle (veya eğitmek istiyorsanız train() fonksiyonunu çağırın)
recommender = IstanbulMLRecommender()
recommender.load_data_from_db()
recommender.train()  # Eğer modeli yeniden eğitmek istiyorsanız
# recommender = IstanbulMLRecommender.load_model()  # Eğer eğitilmiş modeli yükleyecekseniz

# Değerlendirme metriklerini al
precision, recall, f1 = recommender.evaluate()

# Metrikleri yazdır
print(f"Precision: {precision:.4f}")
print(f"Recall:    {recall:.4f}")
print(f"F1 Score:  {f1:.4f}")

# Grafik oluştur
metrics = ['Precision', 'Recall', 'F1 Score']
values = [precision, recall, f1]

plt.figure(figsize=(10, 6))
bars = plt.bar(metrics, values, color=['#2ecc71', '#3498db', '#e74c3c'])

# Değerleri çubukların üzerine yazdır
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height,
             f'{height:.4f}',
             ha='center', va='bottom')

plt.title('Model Performans Metrikleri', fontsize=14, pad=20)
plt.ylabel('Değer', fontsize=12)
plt.ylim(0, 1.1)  # Y ekseni 0-1 arası
plt.grid(axis='y', linestyle='--', alpha=0.7)

# Grafiği kaydet
plt.savefig('model_metrics.png', dpi=300, bbox_inches='tight')
plt.close()
