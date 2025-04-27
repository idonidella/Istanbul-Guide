const db = require('../config/db');

async function checkDuplicatePlaces() {
  try {
    console.log('Veritabanında tekrarlanan yerler kontrol ediliyor...');
    
    // İsme göre aynı yerden birden fazla olup olmadığını kontrol et
    const duplicateQuery = `
      SELECT name, COUNT(*) as count, GROUP_CONCAT(id ORDER BY id) as ids
      FROM places
      GROUP BY name
      HAVING COUNT(*) > 1
      ORDER BY count DESC, name
    `;
    
    const [duplicates] = await db.execute(duplicateQuery);
    
    if (duplicates.length === 0) {
      console.log('\n✅ Tebrikler! Veritabanında tekrarlanan yer bulunamadı.');
    } else {
      console.log(`\n⚠️ Toplam ${duplicates.length} farklı yerin tekrarı bulundu:`);
      console.log('------------------------------------------------------');
      
      duplicates.forEach((dup, index) => {
        console.log(`${index + 1}. "${dup.name}" - ${dup.count} kez tekrarlanmış`);
        console.log(`   ID'ler: ${dup.ids}`);
        console.log('------------------------------------------------------');
      });
      
      // Tekrarlanan yerlerin toplam sayısını hesapla
      let totalDuplicates = 0;
      duplicates.forEach(dup => {
        totalDuplicates += (dup.count - 1); // Her grup için bir asıl kayıt tutup diğerlerini sayıyoruz
      });
      
      console.log(`\nToplam ${totalDuplicates} adet tekrarlanan kayıt bulundu.`);
      console.log('Bu kayıtları silmek için aşağıdaki script çalıştırılabilir:');
      console.log('node scripts/remove_duplicate_places.js');
    }
    
    // Toplam kayıt sayısını göster
    const [countResult] = await db.execute('SELECT COUNT(*) as total FROM places');
    console.log(`\nVeri tabanında şu anda toplam ${countResult[0].total} yer kaydı bulunuyor.`);
    
  } catch (error) {
    console.error('Hata:', error.message);
  } finally {
    process.exit(0);
  }
}

// Scripti çalıştır
checkDuplicatePlaces(); 