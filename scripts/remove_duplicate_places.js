const db = require('../config/db');

async function removeDuplicatePlaces() {
  try {
    console.log('Tekrarlanan yer kayıtlarını temizleme işlemi başlatılıyor...');
    
    // Önce tekrarlanan yerlerin bilgisini al
    const duplicateQuery = `
      SELECT name, COUNT(*) as count, GROUP_CONCAT(id ORDER BY id) as ids
      FROM places
      GROUP BY name
      HAVING COUNT(*) > 1
      ORDER BY count DESC, name
    `;
    
    const [duplicates] = await db.execute(duplicateQuery);
    
    if (duplicates.length === 0) {
      console.log('\n✅ Veritabanında tekrarlanan yer kaydı bulunamadı.');
      return;
    }
    
    console.log(`\n📊 Toplam ${duplicates.length} farklı yerin tekrarı bulundu.`);
    
    // Her bir tekrarlanan yer için sadece en düşük ID'li olanı tut, diğerlerini sil
    let totalRemoved = 0;
    
    for (const dup of duplicates) {
      // ID'leri diziye dönüştür
      const idList = dup.ids.split(',').map(id => parseInt(id));
      
      // En düşük ID'li olanı koru
      const keepId = Math.min(...idList);
      
      // Diğerlerini sil
      const deleteIds = idList.filter(id => id !== keepId);
      
      console.log(`🔄 "${dup.name}" için işlem:`);
      console.log(`   - ID ${keepId} korunuyor`);
      console.log(`   - Silinecek ID'ler: ${deleteIds.join(', ')}`);
      
      if (deleteIds.length > 0) {
        // Silme işlemini gerçekleştir
        const deleteQuery = `DELETE FROM places WHERE id IN (${deleteIds.join(',')})`;
        const [result] = await db.execute(deleteQuery);
        
        console.log(`   ✅ ${result.affectedRows} kayıt silindi.`);
        totalRemoved += result.affectedRows;
      }
    }
    
    console.log('\n🧹 Temizlik işlemi tamamlandı!');
    console.log(`✅ Toplam ${totalRemoved} adet tekrarlanan kayıt silindi.`);
    
    // Kalan kayıt sayısını göster
    const [countResult] = await db.execute('SELECT COUNT(*) as total FROM places');
    console.log(`📊 Veri tabanında temizlik sonrası ${countResult[0].total} yer kaydı bulunuyor.`);
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    process.exit(0);
  }
}

// Scripti çalıştır
removeDuplicatePlaces(); 