const db = require('../config/db');

async function checkTableStructure() {
  try {
    console.log('Places tablosunun yapısı kontrol ediliyor...');
    
    // Tablo yapısını sorgulaması
    const [tableInfo] = await db.execute('SHOW CREATE TABLE places');
    console.log('Tablo Yapısı:');
    console.log(tableInfo[0]['Create Table']);
    
    // Tablo motor bilgisi
    const [engineInfo] = await db.execute('SELECT TABLE_NAME, ENGINE, TABLE_ROWS, MAX_DATA_LENGTH FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = "places"');
    console.log('\nTablo Motor Bilgisi:');
    console.log(engineInfo[0]);
    
    // ID veri tipi kontrolü
    const [columns] = await db.execute('SHOW COLUMNS FROM places WHERE Field = "id"');
    console.log('\nID sütun bilgisi:');
    console.log(columns[0]);
    
    // Toplam kayıt sayısı
    const [countResult] = await db.execute('SELECT COUNT(*) as total FROM places');
    console.log(`\nMevcut kayıt sayısı: ${countResult[0].total}`);
    
    console.log('\nTabloyu 4000+ kayıt tutacak şekilde güncellemek için öneriler:');
    console.log('1. AUTO_INCREMENT sınırı varsa kaldırılmalı');
    console.log('2. Tablodaki herhangi bir MAX_ROWS kısıtlaması kaldırılmalı');
    console.log('3. Veritabanı motorunun sınırları kontrol edilmeli');
    
  } catch (error) {
    console.error('Hata:', error.message);
  } finally {
    process.exit(0);
  }
}

// Scripti çalıştır
checkTableStructure(); 