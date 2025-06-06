// public/script.js

const socket = io();

function sendMessage() {
  const sender = localStorage.getItem('username') || "Anonim";
  const message = document.getElementById('message').value;

  if (!sender || !message) return alert("Ad ve mesaj boş olamaz");

  socket.emit('chatMessage', { sender, text: message });
  document.getElementById('message').value = '';
}

socket.on('chatMessage', (data) => {
  const chatBox = document.getElementById('chat-box');
  chatBox.innerHTML += `<p><strong>${data.sender}:</strong> ${data.text}</p>`;
  chatBox.scrollTop = chatBox.scrollHeight;
});

// Sayfa yüklendiğinde geçmiş mesajları getir
window.onload = async () => {
  const res = await fetch('/api/chat/messages');
  const messages = await res.json();

  const chatBox = document.getElementById('chat-box');
  messages.forEach(msg => {
    chatBox.innerHTML += `<p><strong>${msg.sender}:</strong> ${msg.text}</p>`;
  });
  chatBox.scrollTop = chatBox.scrollHeight;
};

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href = '/login.html';
}