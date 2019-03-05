import express from 'express';
import socketIo from 'socket.io';
import { Server } from 'http';

import { eventType } from '../client/js/common';
import { initializeSocketHandler } from './socketService';

const app = express();
const http = Server(app);
const io = socketIo(http);
const DIST_DIR = __dirname;

app.use(express.static(DIST_DIR));
app.get('/', function(req, res) {
  res.sendFile('./dist/index.html', { root: DIST_DIR });
});

const PORT = process.env.PORT || 3000;

io.on(eventType.CONNECTION, socket => {
  initializeSocketHandler(socket, io);
});

http.listen(PORT, function() {
  console.log(`listening on *:${PORT}`);
});
