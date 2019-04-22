// this file is common to server part

const eventType = {
  CLEAR: 'clear',
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'join room',
  INIT: 'init',
  MESSAGE: 'message',
  ME_ACTION: 'me action',
  REMOVE_SAVED_MESSAGE: 'remove message',
  UPDATE_USERS: 'users'
};

module.exports = eventType;
