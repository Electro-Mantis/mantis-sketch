import path from 'path';
import express from 'express';
import http from 'http';

import { setup as setupSockets } from '../server/includes/sockets';

const app = express();
const server = http.createServer(app);

const DIST_DIR = __dirname;
const HTML_FILE = path.join(DIST_DIR, 'index.html');

app.use(express.static(DIST_DIR));

app.get('/', (req, res) => {
  res.sendFile(HTML_FILE);
});

// Set up the socket communications
setupSockets(server);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
