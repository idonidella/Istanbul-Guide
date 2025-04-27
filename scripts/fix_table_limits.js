const db = require('../config/db');

async function fixTableLimits() {
  try {
    console.log('Places tablosu için limit kısıtlamaları kaldırılıyor...');
    
    // AUTO_INCREMENT değerini koruyarak tabloyu MAX_ROWS kısıtlaması olmadan yeniden oluştur
    const query = `
      ALTER TABLE places
      ENGINE=InnoDB
      AVG_ROW_LENGTH=0
      MAX_ROWS=10000000 
      MIN_ROWS=0
      AUTO_INCREMENT=1179
    `;
    
    await db.execute(query);
    console.log('Tablo başarıyla güncellendi. Artık daha fazla veri tutabilir.');
    console.log('MAX_ROWS değeri 10.000.000 olarak ayarlandı.');
    
    // Tablo motor bilgisi
    const [engineInfo] = await db.execute('SELECT TABLE_NAME, ENGINE, TABLE_ROWS, MAX_DATA_LENGTH FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = "places"');
    console.log('\nGüncellenmiş Tablo Motor Bilgisi:');
    console.log(engineInfo[0]);
    
    // Tablonun yeni yapısını göster
    const [tableInfo] = await db.execute('SHOW CREATE TABLE places');
    console.log('\nGüncellenmiş Tablo Yapısı:');
    console.log(tableInfo[0]['Create Table']);
    
  } catch (error) {
    console.error('Hata:', error.message);
  } finally {
    process.exit(0);
  }
}

// Scripti çalıştır
fixTableLimits(); 