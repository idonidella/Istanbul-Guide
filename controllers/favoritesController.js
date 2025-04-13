const db = require('../config/db');

exports.toggleFavorite = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { placeId } = req.body;
        const [existing] = await db.execute(
            'SELECT id FROM favorites WHERE userId = ? AND placeId = ?',
            [userId, placeId]
        );
        if (existing.length > 0) {
            await db.execute('DELETE FROM favorites WHERE userId = ? AND placeId = ?', [userId, placeId]);
            return res.status(200).json({ message: 'Favoriden çıkarıldı', isFavorite: false });
        } else {
            await db.execute('INSERT INTO favorites (userId, placeId) VALUES (?, ?)', [userId, placeId]);
            return res.status(200).json({ message: 'Favorilere eklendi', isFavorite: true });
        }
    } catch (error) {
        console.error('Favori güncelleme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

exports.getUserFavorites = async (req, res) => {
    try {
        const userId = req.user.userId;
        const [rows] = await db.execute(`
        SELECT p.id, p.name, p.description, p.latitude, p.longitude, p.categoryId
        FROM favorites f
        JOIN places p ON f.placeId = p.id
        WHERE f.userId = ?
      `, [userId]);

        res.status(200).json(rows);
    } catch (error) {
        console.error("Favori listeleme hatası:", error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};

exports.removeFavorite = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { placeId } = req.params;

        await db.execute(
            `DELETE FROM favorites WHERE userId = ? AND placeId = ?`,
            [userId, placeId]
        );

        res.status(200).json({ message: "Favori silindi" });
    } catch (error) {
        console.error("Favori silme hatası:", error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};
exports.checkFavorite = async (req, res) => {
    try {
        const userId = req.user.userId;
        const placeId = req.params.placeId;

        const [rows] = await db.execute(
            'SELECT id FROM favorites WHERE userId = ? AND placeId = ?',
            [userId, placeId]
        );

        res.status(200).json({ isFavorite: rows.length > 0 });
    } catch (error) {
        console.error('Favori kontrol hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};
