const User = require('../models/userModel');
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Kullanıcı kaydı
exports.register = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !email || !password || !lastname) {
      return res.status(400).json({ message: 'İsim, soyisim, email ve şifre zorunludur.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Geçerli bir email adresi giriniz' });
    }
    const normalizedEmail = email.toLowerCase();
    const existingUserByEmail = await User.findByEmail(normalizedEmail);
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'Bu email adresi zaten kullanılıyor' });
    }
    // Yeni kullanıcı oluştur
    const userId = await User.create({ firstname, lastname, email: normalizedEmail, password });
    console.log('Yeni kullanıcı oluşturuldu:', userId);
    // Kullanıcı bilgilerini tekrar çek
    const user = await User.findByEmail(normalizedEmail);
    // JWT token oluştur
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.status(201).json({
      data: {
        message: 'Kullanıcı başarıyla kaydedildi',
        data: {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          token,
        }
      }
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Kullanıcı çıkışı sonrası token iptal etme
exports.signOut = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({ message: 'Token bulunamadı' });
    }
    const token = authHeader.split(' ')[1];
    await db.execute('INSERT INTO revoked_tokens (token) VALUES (?)', [token]);
    console.log('Token iptal edildi ÇIKIŞ YAPILDI:', token);
    res.status(200).json({ message: 'Oturum başarıyla sonlandırıldı' });
  } catch (error) {
    console.error('Sign out hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

//uygulama otomatik "beni hatırla" isteği için 
exports.checkSession = async (req, res) => {
  try {
    const userId = req.user.userId;
    const token = req.token;
    const [revoked] = await db.execute('SELECT id FROM revoked_tokens WHERE token = ?', [token]);
    if (revoked.length > 0) {
      return res.status(401).json({ message: 'Token iptal edilmiş' });
    }
    const [rows] = await db.execute('SELECT firstname, lastname, email FROM users WHERE id = ?', [userId]);
    const user = rows[0];
    console.log('Kullanıcı bilgileri check-session endpointi kullanıcıya dönen bilgiler:', user);
    res.status(200).json({
      message: 'Oturum aktif',
      data: user
    });
  } catch (error) {
    console.error('Session kontrol hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};


// Kullanıcı girişi
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basit validasyon
    if (!email || !password) {
      return res.status(400).json({ message: 'Email ve şifre gereklidir' });
    }
    // Kullanıcıyı e-posta ile bul
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email veya şifre yanlış. Lütfen hesap bilgilerinizi kontrol edip tekrar deneyin' });
    }
    // Şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Geçersiz kimlik bilgileri' });
    }
    // JWT token oluştur
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log("Kullanıcı girişi başarılı:", user.id);
    res.status(200).json({
      data: {
        message: 'Giriş başarılı',
        data: {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          token,
        }
      }
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};