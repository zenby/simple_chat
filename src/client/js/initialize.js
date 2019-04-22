import { activatePageTitleChangingAfterFocus } from './utils/windowUtils';
import {
  saveUsernameOnExit,
  getUserName,
  updateUserNameInStorage
} from './utils/storageUtils';
import { closeModal, modalPopupOnImageClick } from './utils/modalUtils';
import { emitRemoveSavedMessage } from './index';

const userInput = document.querySelector('.user_input');
const close = document.querySelector('span.close');
const modal = document.getElementById('modal');
const messages = document.querySelector('#messages');

export function initializeEventListeners() {
  userInput.value = getUserName();

  userInput.addEventListener('change', ev => {
    updateUserNameInStorage(ev.target.value);
  });

  window.addEventListener('beforeunload', () => {
    saveUsernameOnExit(userInput.value);
  });

  messages.addEventListener('click', modalPopupOnImageClick);
  messages.addEventListener('click', ev => {
    if (
      ev.target.tagName === 'IMG' &&
      ev.target.classList.contains('delete_icon')
    ) {
      emitRemoveSavedMessage(ev.target.parentNode.dataset.id);
    }
  });
  close.onclick = closeModal;
  modal.onclick = closeModal;

  activatePageTitleChangingAfterFocus();
}

export function getUsernameQuery() {
  return `username=${userInput.value}`;
}
