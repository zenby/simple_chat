var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
  console.log('A user connected');

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function() {
    console.log('A user disconnected');
  });

  socket.on('message', function(data) {
    const { message, username } = data;
    io.sockets.emit('message', { message, username: username || 'Anonymous' });
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
