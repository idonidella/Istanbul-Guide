import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam
from sklearn.metrics import precision_score, recall_score, f1_score, roc_curve, auc, confusion_matrix
from ml_model import IstanbulMLRecommender
import logging

def train_and_evaluate_models():
    recommender = IstanbulMLRecommender()
    recommender.load_data_from_db()
    X_train, X_test, y_train, y_test = recommender.prepare_training_data()
    models = {
        'KNN': KNeighborsClassifier(n_neighbors=5),
        'Decision Tree': DecisionTreeClassifier(max_depth=5, random_state=42),
        'Random Forest': RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
    }
    results = []
    y_scores = {}
    y_preds = {}
    for name, model in models.items():
        model.fit(X_train, y_train)
        if hasattr(model, "predict_proba"):
            y_score = model.predict_proba(X_test)[:, 1]
        else:
            y_score = model.decision_function(X_test)
        y_pred = model.predict(X_test)
        y_scores[name] = y_score
        y_preds[name] = y_pred
        precision = precision_score(y_test, y_pred)
        recall = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        results.append({
            'Model': name,
            'Precision': precision,
            'Recall': recall,
            'F1 Score': f1
        })
    # YSA (IstanbulMLRecommender'ın kendi modeli)
    recommender.train()
    y_score_nn = recommender.model.predict(X_test)
    y_pred_nn = (y_score_nn > 0.5).astype(int)
    y_scores['Yapay Sinir Ağı'] = y_score_nn.flatten()
    y_preds['Yapay Sinir Ağı'] = y_pred_nn.flatten()
    precision, recall, f1 = recommender.evaluate()
    results.append({
        'Model': 'Yapay Sinir Ağı',
        'Precision': precision,
        'Recall': recall,
        'F1 Score': f1
    })
    return pd.DataFrame(results), y_test, y_scores, y_preds

def plot_model_comparison(results_df):
    plt.style.use('seaborn-v0_8')
    colors = ['#2ecc71', '#3498db', '#e74c3c']
    fig, ax1 = plt.subplots(figsize=(12, 7))
    x = np.arange(len(results_df['Model']))
    width = 0.25
    ax1.bar(x - width, results_df['Precision'], width, label='Precision', color=colors[0])
    ax1.bar(x, results_df['Recall'], width, label='Recall', color=colors[1])
    ax1.bar(x + width, results_df['F1 Score'], width, label='F1 Score', color=colors[2])
    ax1.set_title('Model Performance Comparison', fontsize=14, pad=20)
    ax1.set_xticks(x)
    ax1.set_xticklabels(results_df['Model'])
    ax1.set_ylim(0, 1.1)
    ax1.legend()
    ax1.grid(True, linestyle='--', alpha=0.7)
    for i in range(len(results_df)):
        ax1.text(i - width, results_df['Precision'][i], f'{results_df["Precision"][i]:.3f}', ha='center', va='bottom')
        ax1.text(i, results_df['Recall'][i], f'{results_df["Recall"][i]:.3f}', ha='center', va='bottom')
        ax1.text(i + width, results_df['F1 Score'][i], f'{results_df["F1 Score"][i]:.3f}', ha='center', va='bottom')
    plt.tight_layout()
    plt.savefig('model_comparison.png', dpi=300, bbox_inches='tight')
    plt.close()

def plot_roc_curves(y_test, y_scores):
    plt.style.use('seaborn-v0_8')
    plt.figure(figsize=(10, 8))
    for name, y_score in y_scores.items():
        fpr, tpr, _ = roc_curve(y_test, y_score)
        roc_auc = auc(fpr, tpr)
        plt.plot(fpr, tpr, lw=2, label=f'{name} (AUC = {roc_auc:.3f})')
    plt.plot([0, 1], [0, 1], color='gray', linestyle='--', lw=2, label='Random')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate (FPR)', fontsize=12)
    plt.ylabel('True Positive Rate (TPR)', fontsize=12)
    plt.title('ROC Curves for All Models', fontsize=14, pad=20)
    plt.legend(loc="lower right", fontsize=10)
    plt.grid(True, linestyle='--', alpha=0.7)
    plt.tight_layout()
    plt.savefig('model_roc_curves.png', dpi=300, bbox_inches='tight')
    plt.close()

def plot_confusion_matrices(y_test, y_preds):
    plt.style.use('seaborn-v0_8')
    n_models = len(y_preds)
    fig, axes = plt.subplots(1, n_models, figsize=(6*n_models, 6))
    if n_models == 1:
        axes = [axes]
    for ax, (name, y_pred) in zip(axes, y_preds.items()):
        cm = confusion_matrix(y_test, y_pred)
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=ax)
        ax.set_title(f'{name} - Confusion Matrix', fontsize=14, pad=20)
        ax.set_xlabel('Predicted Class', fontsize=12)
        ax.set_ylabel('True Class', fontsize=12)
    plt.tight_layout()
    plt.savefig('confusion_matrices.png', dpi=300, bbox_inches='tight')
    plt.close()

if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )
    try:
        logging.info("Modeller eğitiliyor ve değerlendiriliyor...")
        results_df, y_test, y_scores, y_preds = train_and_evaluate_models()
        logging.info("Model karşılaştırma grafiği oluşturuluyor...")
        plot_model_comparison(results_df)
        logging.info("Grafik başarıyla oluşturuldu: model_comparison.png")
        logging.info("ROC eğrileri oluşturuluyor...")
        plot_roc_curves(y_test, y_scores)
        logging.info("Grafik başarıyla oluşturuldu: model_roc_curves.png")
        logging.info("Confusion matrix(ler) oluşturuluyor...")
        plot_confusion_matrices(y_test, y_preds)
        logging.info("Grafik başarıyla oluşturuldu: confusion_matrices.png")
    except Exception as e:
        logging.error(f"İşlem sırasında hata oluştu: {str(e)}") 