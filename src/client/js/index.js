const eventType = require('./common');

import io from 'socket.io-client';
import { base64ImageRegExp } from './constants';
import { getRoomName, getTime } from './utils/stringUtils';
import { showMeActionMessage, showUserMessage } from './actions';
import {
  getUserIDFromStorage,
  activatePageTitleChangingAfterFocus,
  getUserName,
  updateUserNameInStorage,
  saveUsernameOnExit
} from './utils/windowUtils';
import {
  drawSmallTextWithMessage,
  drawSmallText,
  drawOnlineUsers,
  clearChat
} from './utils/drawUtils';

const userInput = document.querySelector('.user_input');
userInput.value = getUserName();
const query = `username=${userInput.value}`;
const socket = io(window.location.origin, { query });
const button = document.querySelector('#send-button');
const messageInput = document.querySelector('.message_input');
const roomInput = document.querySelector('.room_container>select');

const userID = getUserIDFromStorage();

button.addEventListener('click', sendUserMessage);
roomInput.addEventListener('change', ev => {
  socket.emit(eventType.JOIN_ROOM, { userID, roomID: roomInput.value });
});
messageInput.addEventListener('keydown', ev => {
  if (ev.key === 'Enter') {
    sendUserMessage();
  }
  if (ev.key === 'c' && ev.ctrlKey && ev.altKey) {
    socket.emit(eventType.CLEAR);
  }
});
userInput.addEventListener('change', ev => {
  updateUserNameInStorage(ev.target.value);
});
window.addEventListener('beforeunload', () => {
  saveUsernameOnExit(userInput.value);
});

activatePageTitleChangingAfterFocus();
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
        showStyledUserMessage(data);
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
  const user = data.userID === userID ? "You've" : 'New user';
  const smallText = `${user} joined ${getRoomName(data.roomID)}`;
  drawSmallText(smallText);
}

function showStyledUserMessage(data) {
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
socket.on(eventType.MESSAGE, showStyledUserMessage);
socket.on(eventType.ME_ACTION, showMeActionMessage);
socket.on(eventType.CLEAR, clearChat);
socket.on(eventType.UPDATE_USERS, drawOnlineUsers);
