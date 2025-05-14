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
            content: `You are an expert historian and tourism guide in the history and culture of Istanbul. 
            You should provide detailed information under the following headings for the given places:
            1. Historical Background: The establishment date of the building/place, who built it, and important changes it has undergone over time
            2. Architectural Features: The size, materials used, architectural style, and notable architectural details
            3. Cultural Significance: The importance to the community, its religious or cultural value, and its social role over time
            4. Interesting Facts: Unknown features, interesting stories, legends
            5. Practical Information: The best times to visit, important rules to follow, other important places nearby`
          },
          {
            role: "user",
            content: `Generate a comprehensive description written in a formal and informative tone, providing direct information about ${rows[0].name} located in Istanbul. Do not begin your response with conversational phrases. Instead, proceed directly with the following section headings:
            I. Historical Background
            II. Architectural Features
            III. Cultural Significance
            IV. Interesting Facts
            V. Practical information`
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
