const db = require('../config/db');

exports.updateName = async (req, res) => {
  const userId = req.user?.userId;
  const { firstname, lastname } = req.body;

  try {
    if (!firstname || !lastname) {
      return res.status(400).json({ message: 'Ad ve soyad boş bırakılamaz' });
    }

    await db.execute(
      'UPDATE users SET firstname = ?, lastname = ? WHERE id = ?',
      [firstname, lastname, userId]
    );

    // Güncel kullanıcıyı tekrar çekiyoruz
    const [rows] = await db.execute(
      'SELECT firstname, lastname, email FROM users WHERE id = ?',
      [userId]
    );

    const updatedUser = rows[0];

    res.status(200).json({
      data: {
        message: 'İsim başarıyla güncellendi',
        data: {
          firstname: updatedUser.firstname,
          lastname: updatedUser.lastname,
          email: updatedUser.email
        }
      },
    });

  } catch (error) {
    console.error(`[UPDATE-NAME][${userId}] Hata:`, error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};
