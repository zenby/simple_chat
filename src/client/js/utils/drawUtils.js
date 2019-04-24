import linkifyStr from 'linkifyjs/string';
import { find } from 'linkifyjs/lib/linkify';
import { handleNotFocusedPage } from './windowUtils';
import { checkImage, getImageBySource } from './imageUtils';
import { base64ImageRegExp } from '../constants';
import deleteSvg from '../../img/delete.svg';

const messages = document.querySelector('#messages');
const usersList = document.querySelector('.users');

export function drawMessage(messageData, isUserMessage) {
  const { id, userID, username, time, message } = messageData;
  let li;
  const { lastChild } = messages;

  if (
    lastChild &&
    lastChild.dataset.userid === userID &&
    lastChild.dataset.username === username
  ) {
    li = messages.lastChild;
  } else {
    li = document.createElement('li');
    li.dataset.userid = userID;
    li.dataset.username = username;
    if (isUserMessage) {
      li.classList.add('self_message');
    }
    const messageLabel = document.createElement('p');
    messageLabel.classList.add('message_label');
    messageLabel.textContent = `${username} - ${time}`;
    li.appendChild(messageLabel);
    messages.appendChild(li);
  }
  if (message) {
    addMessageToElement(message, li, id, isUserMessage);
  }
  li.scrollIntoView(true);
  handleNotFocusedPage();
}

export function drawAction(messageData) {
  const { id, userID, username, time, message } = messageData;
  const li = document.createElement('li');
  li.classList.add('action_message');
  const actionText = document.createElement('span');
  actionText.textContent = `${username} ${message}`;
  li.appendChild(actionText);
  messages.appendChild(li);
  li.scrollIntoView(true);
  handleNotFocusedPage();
}

function addDeleteIconToElement(id, element) {
  const deleteIcon = document.createElement('img');
  deleteIcon.classList.add('delete_icon');
  deleteIcon.src = deleteSvg;
  element.dataset.id = id;
  element.appendChild(deleteIcon);
}

function addMessageToElement(message, element, id, isUserMessage) {
  const messageContent = document.createElement('div');
  messageContent.classList.add('message_content');
  messageContent.classList.add(
    isUserMessage ? 'my_message' : 'partner_message'
  );
  const base64ImageMatches = message.match(base64ImageRegExp);
  const urls = find(message);
  element.appendChild(messageContent);

  if (base64ImageMatches) {
    base64ImageMatches.forEach(base64ImageSource => {
      drawImage(element, base64ImageSource, isUserMessage);
      message = message.replace(base64ImageSource, '');
    });
  }

  urls.forEach(url => {
    const imageSource = url.href;
    checkImage(imageSource, () => {
      drawImage(element, imageSource, isUserMessage);
      message = message.replace(url.value, '');
      messageContent.innerHTML = linkifyStr(message);
    });
  });
  const linkifiedMessage = linkifyStr(message);
  if (!linkifiedMessage) {
    element.removeChild(messageContent);
  } else {
    messageContent.innerHTML = linkifiedMessage;
  }
  if (id) {
    addDeleteIconToElement(id, messageContent);
  }
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

function drawImage(parent, source, isUserMessage) {
  const image = getImageBySource(source);
  image.classList.add(isUserMessage ? 'my_message' : 'partner_message');
  image.classList.add('message_content');
  parent.appendChild(image);
}

export function removeSavedMessage(id) {
  const message = document.querySelector(`[data-id="${id}"]`);
  const li = message.parentNode;
  if (li.children.length === 2) {
    messages.removeChild(li);
  } else {
    li.removeChild(message);
  }
}
