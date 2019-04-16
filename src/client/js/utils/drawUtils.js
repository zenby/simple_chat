import linkifyStr from 'linkifyjs/string';
import { find } from 'linkifyjs/lib/linkify';
import { handleNotFocusedPage } from './windowUtils';
import { checkImage } from './imageUtils';
import { getStyledImage } from './modalUtils';

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
    const messageContent = document.createElement('span');
    const links = find(message);
    li.appendChild(messageContent);
    links.forEach(({ href, value }) => {
      checkImage(href, () => {
        drawImage(li, href);
        if (value) {
          message = message.replace(value, '');
          messageContent.innerHTML = linkifyStr(message);
        }
      });
    });
    messageContent.innerHTML = linkifyStr(message);
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

export function drawOnlineUsers(users) {
  usersList.innerHTML = '';
  const listItems = users.map(user => {
    const li = document.createElement('li');
    li.textContent = user.username;
    usersList.appendChild(li);
  });
}

function drawImage(parent, link) {
  const br = document.createElement('br');
  const image = getStyledImage(link);

  parent.appendChild(br);
  parent.appendChild(image);
}
