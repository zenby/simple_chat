import io from 'socket.io-client';
import { eventType } from './common';

const socket = io();
const button = document.querySelector('#send-button');
const messageInput = document.querySelector('.message_input');
const userInput = document.querySelector('.user_input');
const messages = document.querySelector('#messages');
const roomInput = document.querySelector('.room_container>select');

const title = {
  FOCUSED: 'Chat',
  NOT_FOCUSED: '* Chat'
};
const storageName = 'sessionStorage';
let userID;
if (window[storageName] && window[storageName].userID) {
  userID = window[storageName].userID;
} else {
  userID = Date.now();
  window[storageName].userID = userID;
}

button.addEventListener('click', sendMessage);
roomInput.addEventListener('change', ev => {
  socket.emit(eventType.JOIN_ROOM, { userID, roomID: roomInput.value });
});
messageInput.addEventListener('keydown', ev => {
  if (ev.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  if (messageInput.value) {
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

function clearChat() {
  socket.emit(eventType.CLEAR);
}

function getTime() {
  return new Date().toLocaleTimeString(undefined, { hour12: false });
}

socket.emit(eventType.INIT);
socket.on(eventType.INIT, messages => {
  messages.forEach(data => {
    switch (data.event) {
      case eventType.MESSAGE:
        showMessageFromUser(data);
        break;
      case eventType.ME_ACTION:
        showMeActionMessage(data);
        break;
      default:
        break;
    }
  });
});

socket.on(eventType.JOIN_ROOM, data => {
  const { roomID } = data;
  const user = data.userID === userID ? "You've" : 'New user';
  const text = `${user} joined ${getRoomName(roomID)}`;
  drawText(text);
});

function getRoomName(roomID) {
  return roomID === '0' ? 'Main room' : `Room ${roomID}`;
}

function showMessageFromUser(data) {
  const li = document.createElement('li');
  if (data.userID === userID) {
    li.classList.add('self_message');
  }
  const { username, message, time, roomID } = data;
  const span = document.createElement('span');
  span.classList.add('small-text');
  span.textContent = `${username}: ${time} ${getRoomName(roomID)}`;
  const text = document.createTextNode(message);
  li.appendChild(span);
  li.appendChild(text);
  messages.appendChild(li);
  li.scrollIntoView(true);
  changePageTitleIfNotFocused();
}

function changePageTitleIfNotFocused() {
  if (!document.hasFocus()) {
    document.title = title.NOT_FOCUSED;
  }
}

window.addEventListener('focus', () => {
  document.title = title.FOCUSED;
});

function showMeActionMessage(data) {
  const { message, username } = data;
  const text = `${username} ${message}`;
  drawText(text);
}

function drawText(text) {
  const li = document.createElement('li');
  const span = document.createElement('span');
  span.classList.add('small-text');
  span.textContent = text;
  li.appendChild(span);
  messages.appendChild(li);
  li.scrollIntoView(true);
  changePageTitleIfNotFocused();
}

socket.on(eventType.MESSAGE, showMessageFromUser);
socket.on(eventType.ME_ACTION, showMeActionMessage);

socket.on(eventType.CLEAR, data => {
  messages.innerHTML = '';
});
