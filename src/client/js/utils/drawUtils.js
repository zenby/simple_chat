import { changePageTitleIfNotFocused } from './windowUtils';

const messages = document.querySelector('#messages');

export function drawSmallTextWithMessage(smallText, message, isUserMessage) {
  const li = document.createElement('li');
  if (isUserMessage) {
    li.classList.add('self_message');
  }
  const span = document.createElement('span');
  span.classList.add('small-text');
  span.textContent = smallText;
  li.appendChild(span);
  if (message) {
    const text = document.createTextNode(message);
    li.appendChild(text);
  }
  messages.appendChild(li);
  li.scrollIntoView(true);
  changePageTitleIfNotFocused();
}

export function drawSmallText(smallText) {
  drawSmallTextWithMessage(smallText);
}

export function clearChat() {
  const messages = document.querySelector('#messages');
  messages.innerHTML = '';
}
