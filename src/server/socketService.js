const eventType = require('../client/js/common');
const {
  store,
  users,
  addToStore,
  addToUsers,
  removeFromUsers
} = require('./store');

const DEFAULT_USERNAME = 'Anonymous';

const initializeSocketHandler = (socket, io) => {
  const updateUsers = () => {
    io.sockets.emit(eventType.UPDATE_USERS, users);
  };

  console.log('A user connected');
  addToUsers(socket.id, DEFAULT_USERNAME);
  updateUsers();

  socket.on(eventType.DISCONNECT, function() {
    console.log('A user disconnected');
    removeFromUsers(socket.id);
    updateUsers();
  });

  socket.on(eventType.INIT, function(data) {
    socket.emit(eventType.INIT, store);
  });

  socket.on(eventType.MESSAGE, function(data) {
    const { message, username, userID, time, roomID } = data;
    const messageData = {
      message,
      userID,
      roomID,
      time,
      username: username || DEFAULT_USERNAME
    };

    addToUsers(socket.id, username);
    updateUsers();

    const ME_MARKER = '/me ';
    let responceEvent;
    if (message.startsWith(ME_MARKER)) {
      responceEvent = eventType.ME_ACTION;
      messageData.message = messageData.message.replace(ME_MARKER, '');
    } else {
      responceEvent = eventType.MESSAGE;
    }

    if (roomID === '0') {
      io.sockets.emit(responceEvent, messageData);
      addToStore({ ...messageData, event: responceEvent });
    } else {
      io.sockets.to(roomID).emit(responceEvent, messageData);
    }
  });

  socket.on(eventType.CLEAR, function() {
    io.sockets.emit(eventType.CLEAR);
  });

  socket.on(eventType.JOIN_ROOM, function(data) {
    socket.join(data.roomID);
    io.sockets.to(data.roomID).emit(eventType.JOIN_ROOM, data);
  });
};

module.exports = initializeSocketHandler;
