const db = require('../config/db');

exports.getVisitedPlaces = async (req, res) => {
  try {
    const userId = req.user.userId;
    const [rows] = await db.execute(`
      SELECT DISTINCT p.id, p.name, p.description, p.latitude, p.longitude, p.categoryId, vp.scanDate
      FROM visited_places vp
      JOIN places p ON vp.placeId = p.id
      WHERE vp.userId = ?
      ORDER BY vp.scanDate DESC
    `, [userId]);

    res.status(200).json(rows); // frontend tarafında scanDate istenmiyorsa buradan silebilirsin
  } catch (error) {
    console.error("Ziyaret edilen yerler alınamadı:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
