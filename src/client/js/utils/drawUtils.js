import { handleNotFocusedPage } from './windowUtils';
import linkifyStr from 'linkifyjs/string';
import { find } from 'linkifyjs/lib/linkify';
import { checkImage } from './imageUtils';

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
    const links = find(message);
    li.appendChild(messageContent);
    links.forEach(({ href, value }) => {
      checkImage(href, () => {
        drawImage(li, href);
        message = message.replace(value, '');
        messageContent.innerHTML = linkifyStr(message);
      });
    });
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

function success() {
  console.log('success: ', this.src);
}

function drawImage(parent, link) {
  const image = document.createElement('img');
  const br = document.createElement('br');
  image.src = link;
  image.style.width = '100px';
  image.style.height = '100px';
  parent.appendChild(br);
  parent.appendChild(image);
}
