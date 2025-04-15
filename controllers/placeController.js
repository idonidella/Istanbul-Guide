const db = require('../config/db');

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
  //title cekicen = ornek ayasofya // 2500 kelimelik bana bilgi ver diycen api 
  try {
    const [rows] = await db.execute('SELECT * FROM places WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Yer bulunamadı' });
    }
    //Veriyi apiden gelen cevapla beraber diger tablo titleriyle birlestirip
    //geri dondur yani rows[0] + api description 
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Yer getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
