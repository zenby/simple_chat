// this file is common to server part

const eventType = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  INIT: 'init',
  MESSAGE: 'message',
  CLEAR: 'clear',
  JOIN_ROOM: 'join room',
  ME_ACTION: 'me action',
  UPDATE_USERS: 'users'
};

module.exports = eventType;
