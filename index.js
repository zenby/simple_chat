var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

const PORT = process.env.PORT || 3000;

io.on('connection', function(socket) {
  console.log('A user connected');

  socket.on('disconnect', function() {
    console.log('A user disconnected');
  });

  socket.on('message', function(data) {
    const { message, username, userID } = data;
    io.sockets.emit('message', {
      message,
      userID,
      username: username || 'Anonymous'
    });
  });

  socket.on('clear', function() {
    io.sockets.emit('clear');
  });
});

http.listen(PORT, function() {
  console.log(`listening on *:${PORT}`);
});
