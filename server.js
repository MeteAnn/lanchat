// server.js


const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');



// Rotalar (auth işlemleri için)
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

// MongoDB bağlantısı (yerel kullanım için)
mongoose.connect('mongodb://localhost/lanchat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB bağlantısı başarılı'))
  .catch((err) => console.error('❌ MongoDB bağlantı hatası:', err));

// Middleware'ler
app.use(cors());
app.use(express.json());


// 🌟 Statik dosyalar (HTML, JS, CSS)
app.use(express.static('public'));


// Rotaları kullanıma al
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Basit test endpoint’i
app.get('/', (req, res) => {
  res.send('Sunucu çalışıyor 👍');
});

// Socket bağlantısı
io.on('connection', (socket) => {
  console.log('📡 Yeni kullanıcı bağlandı:', socket.id);

  socket.on('chatMessage', async (data) => {
    console.log('💬 Mesaj geldi:', data);

    // Veritabanına kaydet
    const Message = require('./models/Message');
    const newMsg = new Message({ sender: data.sender, text: data.text });
    await newMsg.save();

    // Tüm bağlı kullanıcılara mesajı gönder
    io.emit('chatMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Kullanıcı ayrıldı:', socket.id);
  });
});

// Sunucuyu başlat
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Sunucu ayakta: http://localhost:${PORT}`);
});

