import io from 'socket.io-client';
import { eventType } from './common';

const socket = io();
const button = document.querySelector('#send-button');
const messageInput = document.querySelector('.message_input');
const userInput = document.querySelector('.user_input');
const messages = document.querySelector('#messages');
const roomInput = document.querySelector('.room_container>select');

let userID;
const storageName = 'sessionStorage';
if (window[storageName].userID) {
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
        showMessageFromServer(data);
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
  const li = document.createElement('li');
  const span = document.createElement('span');
  span.classList.add('small-text');
  span.textContent = `${user} joined ${getRoomName(roomID)}`;
  li.appendChild(span);
  messages.appendChild(li);
  li.scrollIntoView(true);
});

function getRoomName(roomID) {
  return roomID === '0' ? 'Main room' : `Room ${roomID}`;
}

function showMessageFromServer(data) {
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
}

function showMeActionMessage(data) {
  const { message, username } = data;
  const li = document.createElement('li');
  const span = document.createElement('span');
  span.classList.add('small-text');
  span.textContent = `${username} ${message}`;
  li.appendChild(span);
  messages.appendChild(li);
  li.scrollIntoView(true);
}

socket.on(eventType.MESSAGE, showMessageFromServer);
socket.on(eventType.ME_ACTION, showMeActionMessage);

socket.on(eventType.CLEAR, data => {
  messages.innerHTML = '';
});
