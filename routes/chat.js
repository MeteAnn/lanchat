// routes/chat.js

const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// ✅ Mesaj gönderme
router.post('/send', async (req, res) => {
  try {
    const { sender, text } = req.body;

    const newMessage = new Message({ sender, text });
    await newMessage.save();

    res.status(201).json({ msg: 'Mesaj kaydedildi' });
  } catch (err) {
    res.status(500).json({ msg: 'Sunucu hatası', error: err.message });
  }
});

// ✅ Mesajları listeleme
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: 'Mesajlar alınamadı', error: err.message });
  }
});

module.exports = router;