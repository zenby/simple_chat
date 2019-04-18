import linkifyStr from 'linkifyjs/string';
import { find } from 'linkifyjs/lib/linkify';
import { handleNotFocusedPage } from './windowUtils';
import { checkImage, getImageBySource } from './imageUtils';
import { base64ImageRegExp } from '../constants';

const messages = document.querySelector('#messages');
const usersList = document.querySelector('.users');

export function drawSmallTextWithMessage(smallText, message, isUserMessage) {
  const li = document.createElement('li');
  if (isUserMessage) {
    li.classList.add('self_message');
  }
  const messageInfo = document.createElement('span');
  messageInfo.classList.add('small-text');
  messageInfo.textContent = smallText;
  li.appendChild(messageInfo);
  if (message) {
    addMessageToElement(message, li);
  }
  messages.appendChild(li);
  li.scrollIntoView(true);
  handleNotFocusedPage();
}

function addMessageToElement(message, element) {
  const messageContent = document.createElement('span');
  const base64ImageMatches = message.match(base64ImageRegExp);
  const urls = find(message);
  element.appendChild(messageContent);

  if (base64ImageMatches) {
    base64ImageMatches.forEach(base64ImageSource => {
      drawImage(element, base64ImageSource);
      message = message.replace(base64ImageSource, '');
    });
  }

  urls.forEach(url => {
    const imageSource = url.href;
    checkImage(imageSource, () => {
      drawImage(element, imageSource);
      message = message.replace(url.value, '');
      messageContent.innerHTML = linkifyStr(message);
    });
  });
  messageContent.innerHTML = linkifyStr(message);
}

export function drawSmallText(smallText) {
  drawSmallTextWithMessage(smallText);
}

export function clearChat() {
  const messages = document.querySelector('#messages');
  messages.innerHTML = '';
}

export function drawOnlineUsers(users) {
  usersList.innerHTML = '';
  const listItems = users.map(user => {
    const li = document.createElement('li');
    li.textContent = user.username;
    usersList.appendChild(li);
  });
}

function drawImage(parent, source) {
  const br = document.createElement('br');
  const image = getImageBySource(source);

  parent.appendChild(br);
  parent.appendChild(image);
}
