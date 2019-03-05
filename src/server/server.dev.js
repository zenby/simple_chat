import path from 'path';
import express from 'express';
import socketIo from 'socket.io';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { Server } from 'http';

import config from '../../webpack.dev.config';
import { initializeSocketHandler } from './socketService';
import { store, addToStore } from './store';
import { eventType } from '../client/js/common';

const app = express();
const http = Server(app);
const io = socketIo(http);
const DIST_DIR = __dirname;
const HTML_FILE = path.join(DIST_DIR, 'index.html');
const compiler = webpack(config);

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  })
);
app.use(webpackHotMiddleware(compiler));

app.get('/', function(req, res) {
  compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
    if (err) {
      return next(err);
    }
    res.set('content-type', 'text/html');
    res.send(result);
    res.end();
  });
});

const PORT = process.env.PORT || 3000;

io.on(eventType.CONNECTION, socket => {
  initializeSocketHandler(socket, io);
});

http.listen(PORT, function() {
  console.log(`listening on *:${PORT}`);
});
