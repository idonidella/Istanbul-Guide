const db = require('../config/db');
const openai = require('../config/openai');

exports.getPlaceByQrCode = async (req, res) => {
  try {
    const { code } = req.query;
    const userId = req.user.userId;

    // 1. QR koddan yapıyı al
    const [places] = await db.execute('SELECT * FROM places WHERE qrCode = ?', [code]);
    if (places.length === 0) {
      return res.status(404).json({ message: 'QR koduna karşılık gelen yer bulunamadı' });
    }

    const place = places[0];

    // 2. visited_places tablosuna kaydı var mı kontrol et
    const [visited] = await db.execute(
      'SELECT * FROM visited_places WHERE userId = ? AND placeId = ?',
      [userId, place.id]
    );
    if (visited.length === 0) {
      await db.execute(
        'INSERT INTO visited_places (userId, placeId, scanDate) VALUES (?, ?, NOW())',
        [userId, place.id]
      );
      console.log('Ziyaret eklendi:', userId, place.id);
    }

    // 3. hobbies tablosuna daha önce eklenmemişse categoryId kaydı ekle
    const [existingHobby] = await db.execute(
      'SELECT * FROM hobbies WHERE userId = ? AND categoryId = ?',
      [userId, place.categoryId]
    );
    if (existingHobby.length === 0) {
      await db.execute(
        'INSERT INTO hobbies (userId, categoryId, createdAt) VALUES (?, ?, NOW())',
        [userId, place.categoryId]
      );
      console.log('Hobi eklendi:', userId, place.categoryId);
    }

    // 4. place verisini dön
    res.status(200).json(place);

  } catch (error) {
    console.error('QR kod işleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

exports.getPlaceById = async (req, res) => {
  const { id } = req.params;
  console.log('Yer ID:', id);
  
  try {
    console.log('Veritabanından yer bilgisi alınıyor...');
    const [rows] = await db.execute('SELECT * FROM places WHERE id = ?', [id]);
    if (rows.length === 0) {
      console.log('Yer bulunamadı, ID:', id);
      return res.status(404).json({ message: 'Yer bulunamadı' });
    }
    console.log('Yer bulundu:', rows[0].name);

    // Eğer description boşsa veya null ise GPT'den al
    if (!rows[0].description) {
      console.log('GPT API\'ye istek gönderiliyor...');
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Sen İstanbul'un tarihi ve kültürel mirası konusunda uzman bir tarihçi ve turizm rehberisin. 
            Verilen mekanlar hakkında şu başlıklar altında detaylı bilgiler vermelisin:
            1. Tarihi Geçmiş: Yapının/mekanın kuruluş tarihi, kim tarafından yapıldığı, tarih boyunca geçirdiği önemli değişiklikler
            2. Mimari Özellikler: Yapının boyutları, kullanılan malzemeler, mimari tarzı, öne çıkan mimari detayları
            3. Kültürel Önemi: Toplum için önemi, dini veya kültürel değeri, geçmişten günümüze toplumsal rolü
            4. İlgi Çekici Detaylar: Az bilinen özellikler, ilginç hikayeler, efsaneler
            5. Pratik Bilgiler: Ziyaret için en uygun zamanlar, dikkat edilmesi gereken kurallar, yakınındaki diğer önemli mekanlar`
          },
          {
            role: "user",
            content: `İstanbul'daki ${rows[0].name} hakkında doğrudan bilgi veren, resmi bir anlatım tarzıyla yazılmış kapsamlı bir açıklama üret. Cevabın giriş cümlesi olarak sohbet başlatma ifadeleri kullanma. Açıklamanı direkt olarak aşağıdaki başlıklarla başlayarak devam ettir: 
            I. Tarihi Geçmiş 
            II. Mimari Özellikler 
            III. Kültürel Önemi 
            IV. İlgi Çekici Detaylar 
            V. Pratik Bilgiler`
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      });
      
      const description = completion.choices[0].message.content;
      console.log('GPT API yanıt verdi, açıklama uzunluğu:', description.length);

      // Description'ı direkt places tablosuna kaydet
      await db.execute(
        'UPDATE places SET description = ? WHERE id = ?',
        [description, id]
      );
      console.log('Açıklama places tablosuna kaydedildi');

      rows[0].description = description;
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Hata detayı:', error.message);
    console.error('Tam hata:', error);
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error.message 
    });
  }
};
