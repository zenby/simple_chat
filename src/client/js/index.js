const eventType = require('./common');

import io from 'socket.io-client';
import { base64ImageRegExp } from './constants';
import { getRoomName, getTime } from './utils/stringUtils';
import { getUserIDFromStorage } from './utils/storageUtils';
import { initializeEventListeners, getUsernameQuery } from './initialize';
import { showUserJoinRoomMessage } from './actions';
import {
  drawMessage,
  drawAction,
  drawOnlineUsers,
  clearChat,
  removeSavedMessage
} from './utils/drawUtils';

initializeEventListeners();

const socket = io(window.location.origin, { query: getUsernameQuery() });
const userInput = document.querySelector('.user_input');
const sendButton = document.querySelector('#send-button');
const messageInput = document.querySelector('.message_input');
const roomInput = document.querySelector('.settings_container>select');
const userID = getUserIDFromStorage();

sendButton.addEventListener('click', () => {
  sendUserMessage();
});
roomInput.addEventListener('change', () => {
  clearChat();
  const data = {
    userID,
    roomID: roomInput.value,
    username: userInput.value.trim()
  };
  socket.emit(eventType.JOIN_ROOM, data);
  if (roomInput.value === '0') {
    socket.emit(eventType.INIT);
  }
});
messageInput.addEventListener('keydown', ev => {
  if (ev.key === 'Enter') {
    sendUserMessage();
  }
  if (ev.key === 'c' && ev.ctrlKey && ev.altKey) {
    socket.emit(eventType.CLEAR);
  }
});

socket.emit(eventType.INIT);

function sendUserMessage(message) {
  if ((messageInput.value.trim() || message) && userInput.value.trim()) {
    socket.emit(eventType.MESSAGE, {
      message: message || messageInput.value.trim(),
      username: userInput.value.trim(),
      roomID: roomInput.value,
      userID: userID,
      time: getTime()
    });
    messageInput.value = '';
  }
}

function handleUserInit(storeDataArray) {
  storeDataArray.forEach(data => {
    switch (data.event) {
      case eventType.MESSAGE:
        showMessage(data);
        break;
      case eventType.ME_ACTION:
        drawAction(data);
        break;
      default:
        break;
    }
  });
}

function showJoinRoomMessage(data) {
  showUserJoinRoomMessage(data, userID);
}

function showMessage(data) {
  drawMessage(data, userID === data.userID);
}

document.onpaste = function(event) {
  const items = event.clipboardData.items;
  for (const index in items) {
    const item = items[index];
    if (item.kind === 'file') {
      const blob = item.getAsFile();
      const reader = new FileReader();
      reader.onload = function(ev) {
        if (base64ImageRegExp.test(ev.target.result)) {
          const message = messageInput.value.trim()
            ? messageInput.value.trim() + ev.target.result
            : ev.target.result;
          sendUserMessage(message);
        }
      };
      reader.readAsDataURL(blob);
    }
  }
};

export function emitRemoveSavedMessage(id) {
  socket.emit(eventType.REMOVE_SAVED_MESSAGE, id);
}

socket.on(eventType.INIT, handleUserInit);
socket.on(eventType.JOIN_ROOM, showJoinRoomMessage);
socket.on(eventType.MESSAGE, showMessage);
socket.on(eventType.ME_ACTION, drawAction);
socket.on(eventType.CLEAR, clearChat);
socket.on(eventType.UPDATE_USERS, drawOnlineUsers);
socket.on(eventType.REMOVE_SAVED_MESSAGE, removeSavedMessage);
