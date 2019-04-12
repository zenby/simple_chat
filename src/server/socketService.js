const eventType = require('../client/js/common');
const { store, addToStore, addToUsers, removeFromUsers } = require('./store');
const DEFAULT_USERNAME = 'Anonymous';
let users = [];

const initializeSocketHandler = (socket, io) => {
  const sendUpdatedUsers = () => {
    io.sockets.emit(eventType.UPDATE_USERS, users);
  };

  console.log('A user connected');
  const name = socket.handshake.query.username || DEFAULT_USERNAME;
  users = addToUsers(users, socket.id, name);
  sendUpdatedUsers();

  socket.on(eventType.DISCONNECT, function() {
    console.log('A user disconnected');
    users = removeFromUsers(users, socket.id);
    sendUpdatedUsers();
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

    users = addToUsers(users, socket.id, username);
    sendUpdatedUsers();

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
