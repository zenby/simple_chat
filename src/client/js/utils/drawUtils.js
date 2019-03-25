import { handleNotFocusedPage } from './windowUtils';
import linkifyStr from 'linkifyjs/string';

const messages = document.querySelector('#messages');

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
    const messageContent = document.createElement('span');
    messageContent.innerHTML = linkifyStr(message);
    li.appendChild(messageContent);
  }
  messages.appendChild(li);
  li.scrollIntoView(true);
  handleNotFocusedPage();
}

export function drawSmallText(smallText) {
  drawSmallTextWithMessage(smallText);
}

export function clearChat() {
  const messages = document.querySelector('#messages');
  messages.innerHTML = '';
}
