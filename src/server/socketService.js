const eventType = require('../client/js/common');
const { store, addToStore, updateUsers, removeFromUsers } = require('./store');
const DEFAULT_USERNAME = 'Anonymous';
let users = [];

const initializeSocketHandler = (socket, io) => {
  const sendUpdatedUsers = () => {
    io.sockets.emit(eventType.UPDATE_USERS, users);
  };

  const name = socket.handshake.query.username || DEFAULT_USERNAME;
  console.log(`A user ${name} is connected`);
  users = updateUsers(users, socket.id, name);
  sendUpdatedUsers();

  socket.on(eventType.DISCONNECT, function() {
    const user = users.find(user => user.id === socket.id);
    const username = user ? user.username : DEFAULT_USERNAME;
    console.log(`A user ${username} is disconnected`);
    users = removeFromUsers(users, socket.id);
    sendUpdatedUsers();
  });

  socket.on(eventType.INIT, function(data) {
    socket.emit(eventType.INIT, store);
  });

  socket.on(eventType.MESSAGE, function(data) {
    const { message, roomID, username } = data;
    const messageData = { ...data, username: username || DEFAULT_USERNAME };

    users = updateUsers(users, socket.id, username);
    sendUpdatedUsers();

    const ME_MARKERS = ['/me ', '.ьу '];
    let responseEvent;
    if (message && ME_MARKERS.some(marker => message.startsWith(marker))) {
      responseEvent = eventType.ME_ACTION;
      messageData.message = message.substring(4);
    } else {
      responseEvent = eventType.MESSAGE;
    }

    if (roomID === '0') {
      io.sockets.emit(responseEvent, messageData);
      addToStore({ ...messageData, event: responseEvent });
    } else {
      io.sockets.to(roomID).emit(responseEvent, messageData);
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
