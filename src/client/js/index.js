const eventType = require('./common');

import io from 'socket.io-client';
import { base64ImageRegExp } from './constants';
import { getRoomName, getTime } from './utils/stringUtils';
import { getUserIDFromStorage } from './utils/storageUtils';
import { initializeEventListeners, getUsernameQuery } from './initialize';
import {
  showMeActionMessage,
  showUserMessage,
  showUserJoinRoomMessage
} from './actions';
import {
  drawSmallTextWithMessage,
  drawSmallText,
  drawOnlineUsers,
  clearChat
} from './utils/drawUtils';

initializeEventListeners();

const socket = io(window.location.origin, { query: getUsernameQuery() });
const userInput = document.querySelector('.user_input');
const sendButton = document.querySelector('#send-button');
const messageInput = document.querySelector('.message_input');
const roomInput = document.querySelector('.room_container>select');
const userID = getUserIDFromStorage();

sendButton.addEventListener('click', () => {
  sendUserMessage();
});
roomInput.addEventListener('change', () => {
  const data = { userID, roomID: roomInput.value };
  socket.emit(eventType.JOIN_ROOM, data);
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
  if ((messageInput.value || message) && userInput.value) {
    socket.emit(eventType.MESSAGE, {
      message: message || messageInput.value,
      username: userInput.value,
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
        showMeActionMessage(data);
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
  showUserMessage(data, userID);
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
          const message = messageInput.value
            ? messageInput.value + ev.target.result
            : ev.target.result;
          sendUserMessage(message);
        }
      };
      reader.readAsDataURL(blob);
    }
  }
};

socket.on(eventType.INIT, handleUserInit);
socket.on(eventType.JOIN_ROOM, showJoinRoomMessage);
socket.on(eventType.MESSAGE, showMessage);
socket.on(eventType.ME_ACTION, showMeActionMessage);
socket.on(eventType.CLEAR, clearChat);
socket.on(eventType.UPDATE_USERS, drawOnlineUsers);
