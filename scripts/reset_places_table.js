const db = require('../config/db');

async function resetPlacesTable() {
  try {
    console.log('Veritabanı tabloları sıfırlanıyor...');
    
    // Foreign key kontrolünü geçici olarak devre dışı bırak
    await db.execute('SET FOREIGN_KEY_CHECKS = 0');
    console.log('Foreign key kontrolleri geçici olarak devre dışı bırakıldı.');
    
    // İlgili tabloları sıfırla (places tablosuna referans veren tablolar)
    await db.execute('TRUNCATE TABLE favorites');
    console.log('Favorites tablosu boşaltıldı.');
    
    // Places tablosunu sıfırla
    await db.execute('TRUNCATE TABLE places');
    console.log('Places tablosu boşaltıldı.');
    
    // Auto-increment değerini 1'e sıfırla
    await db.execute('ALTER TABLE places AUTO_INCREMENT = 1');
    console.log('Places tablosu auto-increment değeri 1 olarak ayarlandı.');
    
    // Foreign key kontrolünü yeniden etkinleştir
    await db.execute('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Foreign key kontrolleri yeniden etkinleştirildi.');
    
    console.log('İşlem başarıyla tamamlandı. Places tablosu sıfırlandı ve ID değerleri 1\'den başlayacak şekilde ayarlandı.');
    
  } catch (error) {
    console.error('Hata:', error.message);
    
    // Hata durumunda da foreign key kontrolünü yeniden etkinleştirmeyi dene
    try {
      await db.execute('SET FOREIGN_KEY_CHECKS = 1');
      console.log('Foreign key kontrolleri yeniden etkinleştirildi.');
    } catch (innerError) {
      console.error('Foreign key kontrollerini yeniden etkinleştirirken hata:', innerError.message);
    }
  } finally {
    process.exit(0);
  }
}

// Scripti çalıştır
resetPlacesTable(); 