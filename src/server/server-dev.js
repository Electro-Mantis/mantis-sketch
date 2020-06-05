import path from 'path';
import express from 'express';
import http from 'http';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../../webpack.dev.config.js';

import {setup as setupSockets} from '../server/includes/sockets';

const app = express();
const server = http.createServer(app);
const compiler = webpack(config);

const DIST_DIR = __dirname;
const HTML_FILE = path.join(DIST_DIR, 'index.html');

// region webpack middleware stuff for HMR
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
// endregion

// Set up the socket communications
setupSockets(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
