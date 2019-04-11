const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const path = require('path');

const eventType = require('../client/js/common');
const initializeSocketHandler = require('./socketService');

const app = express();
const server = http.Server(app);
const io = socketIo(server);
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('../../webpack.dev.config');
  const compiler = webpack(config);
  const pathConfig = { publicPath: config.output.publicPath };

  app.use(webpackDevMiddleware(compiler, pathConfig));
  app.use(webpackHotMiddleware(compiler));
}

app.use(express.static(path.resolve('./dist')));
app.get('/', (req, res) => {
  res.sendFile(path.resolve('./dist/index.html'));
});

const PORT = process.env.PORT || 3000;

io.on(eventType.CONNECTION, socket => {
  initializeSocketHandler(socket, io);
});

server.listen(PORT, function() {
  console.log(`listening on *:${PORT}`);
});
