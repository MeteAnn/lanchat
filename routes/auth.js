// routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Kayıt (Register)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kullanıcı var mı kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'Bu e-posta zaten kayıtlı.' });

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ msg: 'Kayıt başarılı' });
  } catch (err) {
    res.status(500).json({ msg: 'Sunucu hatası', error: err.message });
  }
});

// Giriş (Login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcı var mı?
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'Kullanıcı bulunamadı' });

    // Şifre kontrol
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Geçersiz şifre' });

    // Token oluştur
    const token = jwt.sign({ id: user._id }, 'süpergizli', { expiresIn: '1d' });

    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ msg: 'Sunucu hatası', error: err.message });
  }
});

module.exports = router;