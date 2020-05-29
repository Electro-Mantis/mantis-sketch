import path from 'path';
import express from 'express';
import http from 'http';
import socket from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = socket(server);

const DIST_DIR = __dirname;
const HTML_FILE = path.join(DIST_DIR, 'index.html');

app.use(express.static(DIST_DIR));

app.get('/', (req, res) => {
  res.sendFile(HTML_FILE);
});

io.on('connection', socket => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });

  socket.on('pingServer', data => {
    console.log('Pinged: ' + data);
    io.emit('messageChannel', 'pinged on:' + Date.now());
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
