const eventType = require('./common');

import io from 'socket.io-client';
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
  clearChat
} from './utils/drawUtils';

const socket = io();
const button = document.querySelector('#send-button');
const messageInput = document.querySelector('.message_input');
const userInput = document.querySelector('.user_input');
const roomInput = document.querySelector('.room_container>select');
const usersList = document.querySelector('.users');

const userID = getUserIDFromStorage();
userInput.value = getUserName();

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

function sendUserMessage() {
  if (messageInput.value && userInput.value) {
    socket.emit(eventType.MESSAGE, {
      message: messageInput.value,
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

function updateUsers(users) {
  usersList.innerHTML = '';
  const listItems = users.map(user => {
    const li = document.createElement('li');
    li.textContent = user.username;
    usersList.appendChild(li);
  });
}

socket.on(eventType.INIT, handleUserInit);
socket.on(eventType.JOIN_ROOM, showJoinRoomMessage);
socket.on(eventType.MESSAGE, showStyledUserMessage);
socket.on(eventType.ME_ACTION, showMeActionMessage);
socket.on(eventType.CLEAR, clearChat);
socket.on(eventType.UPDATE_USERS, updateUsers);
