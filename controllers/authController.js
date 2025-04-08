const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Kullanıcı kaydı
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
      return res.status(401).json({ message: 'Geçersiz kimlik bilgileri' });
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