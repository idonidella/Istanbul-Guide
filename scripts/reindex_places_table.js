const db = require('../config/db');

async function reindexPlacesTable() {
  try {
    console.log('Places tablosundaki ID değerleri yeniden düzenleniyor...');
    
    // Tabloyu geçici olarak yedekle
    console.log('1. Mevcut verileri yedekleme...');
    await db.execute('CREATE TABLE places_temp LIKE places');
    await db.execute('INSERT INTO places_temp SELECT * FROM places ORDER BY id');
    console.log('   ✅ Veriler geçici tabloya kopyalandı.');
    
    // Mevcut verileri say
    const [countResult] = await db.execute('SELECT COUNT(*) as total FROM places');
    const totalRecords = countResult[0].total;
    console.log(`   📊 Toplam ${totalRecords} kayıt işlenecek.`);
    
    // Foreign key kontrollerini devre dışı bırak
    await db.execute('SET FOREIGN_KEY_CHECKS = 0');
    console.log('2. Foreign key kontrolleri geçici olarak devre dışı bırakıldı.');
    
    // İlişkili tabloları yedekle (varsa)
    console.log('3. İlişkili tablolar yedekleniyor...');
    await db.execute('CREATE TABLE favorites_temp LIKE favorites');
    await db.execute('INSERT INTO favorites_temp SELECT * FROM favorites');
    console.log('   ✅ Favorites tablosu yedeklendi.');
    
    // ID-Eşleştirme tablosu oluştur (ROW_NUMBER yerine alternatif yaklaşım)
    console.log('4. ID eşleştirme tablosu oluşturuluyor...');
    await db.execute('CREATE TEMPORARY TABLE id_mapping (old_id INT, new_id INT)');
    
    // Tüm eski ID'leri al
    const [oldIds] = await db.execute('SELECT id FROM places_temp ORDER BY id');
    
    // Her bir eski ID için yeni ID ata ve eşleştirme tablosuna ekle
    for (let i = 0; i < oldIds.length; i++) {
      const oldId = oldIds[i].id;
      const newId = i + 1; // 1'den başlayan sıralı ID'ler
      await db.execute('INSERT INTO id_mapping (old_id, new_id) VALUES (?, ?)', [oldId, newId]);
    }
    
    console.log('   ✅ ID eşleştirme tablosu oluşturuldu.');
    
    // Places tablosunu boşalt
    console.log('5. Places tablosu temizleniyor...');
    await db.execute('TRUNCATE TABLE places');
    console.log('   ✅ Places tablosu temizlendi.');
    
    // Places tablosu AUTO_INCREMENT değerini 1 olarak ayarla
    await db.execute('ALTER TABLE places AUTO_INCREMENT = 1');
    console.log('   ✅ AUTO_INCREMENT değeri 1 olarak ayarlandı.');
    
    // Verileri yeni sıralı ID'lerle geri ekle
    console.log('6. Veriler yeni ID\'lerle geri ekleniyor...');
    await db.execute(`
      INSERT INTO places (name, description, latitude, longitude, qrCode, categoryId)
      SELECT name, description, latitude, longitude, qrCode, categoryId
      FROM places_temp
      ORDER BY id
    `);
    console.log('   ✅ Veriler yeni ID\'lerle eklendi.');
    
    // İlişkili tabloları güncelle
    console.log('7. İlişkili tablolar güncelleniyor...');
    await db.execute('TRUNCATE TABLE favorites');
    await db.execute(`
      INSERT INTO favorites (userId, placeId)
      SELECT f.userId, m.new_id
      FROM favorites_temp f
      JOIN id_mapping m ON f.placeId = m.old_id
    `);
    console.log('   ✅ Favorites tablosu güncellendi.');
    
    // Geçici tabloları temizle
    console.log('8. Geçici tablolar temizleniyor...');
    await db.execute('DROP TABLE places_temp');
    await db.execute('DROP TABLE favorites_temp');
    console.log('   ✅ Geçici tablolar silindi.');
    
    // Foreign key kontrollerini yeniden etkinleştir
    await db.execute('SET FOREIGN_KEY_CHECKS = 1');
    console.log('9. Foreign key kontrolleri yeniden etkinleştirildi.');
    
    // Yeni toplam kayıt sayısı
    const [newCountResult] = await db.execute('SELECT COUNT(*) as total FROM places');
    console.log(`\n🎉 İşlem tamamlandı! Toplam ${newCountResult[0].total} kayıt sıralı ID'lerle yenilendi.`);
    
    // Son ID bilgisi
    const [maxIdResult] = await db.execute('SELECT MAX(id) as maxId FROM places');
    console.log(`📊 Son ID değeri: ${maxIdResult[0].maxId}`);
    console.log('📊 Bir sonraki kayıt ID değeri: ' + (maxIdResult[0].maxId + 1));
    
  } catch (error) {
    console.error('\n❌ Hata oluştu:', error.message);
    
    // Hata durumunda foreign key kontrollerini yeniden etkinleştirmeye çalış
    try {
      await db.execute('SET FOREIGN_KEY_CHECKS = 1');
      console.log('⚠️ Foreign key kontrolleri yeniden etkinleştirildi.');
    } catch (innerError) {
      console.error('⚠️ Foreign key kontrollerini etkinleştirirken hata:', innerError.message);
    }
  } finally {
    process.exit(0);
  }
}

// Scripti çalıştır
reindexPlacesTable(); 