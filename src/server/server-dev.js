import path from 'path';
import express from 'express';
import http from 'http';
import socket from 'socket.io';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../../webpack.dev.config.js';

const app = express();
const server = http.createServer(app);
const io = socket(server);
const compiler = webpack(config);

const DIST_DIR = __dirname;
const HTML_FILE = path.join(DIST_DIR, 'index.html');

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  })
);

app.use(webpackHotMiddleware(compiler));

app.get('*', (req, res, next) => {
  compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
    if (err) {
      return next(err);
    }
    res.set('content-type', 'text/html');
    res.send(result);
    res.end();
  });
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
