var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var storage = require('./store');

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

const PORT = process.env.PORT || 3000;

const socketEvents = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  INIT: 'init',
  MESSAGE: 'message',
  CLEAR: 'clear'
};
const DEFAULT_USERNAME = 'Anonymous';

io.on(socketEvents.CONNECTION, function(socket) {
  console.log('A user connected');

  socket.on(socketEvents.DISCONNECT, function() {
    console.log('A user disconnected');
  });

  socket.on(socketEvents.INIT, function(data) {
    socket.emit(socketEvents.INIT, storage.store);
  });

  socket.on(socketEvents.MESSAGE, function(data) {
    const { message, username, userID, time } = data;
    const messageData = {
      message,
      userID,
      time,
      username: username || DEFAULT_USERNAME
    };
    io.sockets.emit(socketEvents.MESSAGE, messageData);
    storage.addToStore(messageData);
  });

  socket.on(socketEvents.CLEAR, function() {
    io.sockets.emit(socketEvents.CLEAR);
  });
});

http.listen(PORT, function() {
  console.log(`listening on *:${PORT}`);
});
