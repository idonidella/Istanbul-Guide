const db = require('../config/db');

// Places tablosundaki tüm verileri al
async function getAllPlaces() {
  try {
    const [rows] = await db.execute('SELECT * FROM places ORDER BY id');
    return rows;
  } catch (error) {
    console.error('Veri alma hatası:', error);
    return [];
  }
}

// ID'leri yeniden düzenle
async function reindexPlaces() {
  console.log('Places tablosundaki ID\'ler yeniden düzenleniyor...');

  try {
    // Mevcut ID'lerin yedeğini al
    await db.execute('ALTER TABLE places ADD COLUMN old_id INT');
    await db.execute('UPDATE places SET old_id = id');
    
    console.log('ID\'lerin yedeği alındı.');
    
    // Auto_increment değerini sıfırla
    await db.execute('ALTER TABLE places DROP PRIMARY KEY');
    await db.execute('ALTER TABLE places MODIFY COLUMN id INT');
    
    console.log('Primary key kaldırıldı.');
    
    // Yeni ID'leri 1'den başlayarak ata
    const [places] = await db.execute('SELECT * FROM places ORDER BY old_id');
    
    console.log(`Toplam ${places.length} yer bulundu, yeniden numaralandırılıyor...`);
    
    // Foreign key kontrollerini geçici olarak kapat
    await db.execute('SET FOREIGN_KEY_CHECKS = 0');
    
    // Her kaydı güncelle
    for (let i = 0; i < places.length; i++) {
      const place = places[i];
      const newId = i + 1;
      
      await db.execute(
        'UPDATE places SET id = ? WHERE old_id = ?',
        [newId, place.old_id]
      );
      
      console.log(`Yer güncellendi: "${place.name}" (Eski ID: ${place.old_id} -> Yeni ID: ${newId})`);
      
      // Bağlı tabloları da güncelle
      await db.execute('UPDATE visited_places SET placeId = ? WHERE placeId = ?', [newId, place.old_id]);
      console.log(`- visited_places tablosu güncellendi`);
      
      await db.execute('UPDATE favorites SET placeId = ? WHERE placeId = ?', [newId, place.old_id]);
      console.log(`- favorites tablosu güncellendi`);
    }
    
    // Primary key'i yeniden ayarla
    await db.execute('ALTER TABLE places ADD PRIMARY KEY (id)');
    await db.execute('ALTER TABLE places MODIFY COLUMN id INT AUTO_INCREMENT');
    
    // Auto_increment değerini maksimum ID + 1 olarak ayarla
    await db.execute(`ALTER TABLE places AUTO_INCREMENT = ${places.length + 1}`);
    
    // Yedek sütunu kaldır
    await db.execute('ALTER TABLE places DROP COLUMN old_id');
    
    // Foreign key kontrollerini yeniden aç
    await db.execute('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('\nID\'ler başarıyla yeniden düzenlendi!');
    console.log(`Yeni sıra: 1'den ${places.length}'e kadar.`);
    console.log(`Auto increment değeri ${places.length + 1} olarak ayarlandı.`);
    
  } catch (error) {
    console.error('ID\'leri yeniden düzenlerken hata oluştu:', error);
    
    // Hata durumunda tabloyu eski haline getirmeye çalış
    try {
      await db.execute('SET FOREIGN_KEY_CHECKS = 0');
      await db.execute('UPDATE places SET id = old_id');
      await db.execute('ALTER TABLE places ADD PRIMARY KEY (id)');
      await db.execute('ALTER TABLE places DROP COLUMN old_id');
      await db.execute('SET FOREIGN_KEY_CHECKS = 1');
      console.log('Hata nedeniyle tablo eski haline getirildi.');
    } catch (restoreError) {
      console.error('Tabloyu eski haline getirirken hata oluştu:', restoreError);
      console.error('UYARI: Veritabanı tutarsız durumda olabilir. Yedekten geri yükleme yapmalısınız!');
    }
  }
  
  process.exit(0);
}

// Scripti çalıştır
reindexPlaces(); 