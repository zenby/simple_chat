import defaultSource from '../../img/lizard.png';
import notFocusedSource from '../../img/lizard2.png';

const storageName = 'sessionStorage';
const title = {
  FOCUSED: 'Chat',
  NOT_FOCUSED: '* Chat'
};
const defaultAudio = document.querySelector('.tink');
const owlAudio = document.querySelector('.owl');
const isOwlCheckbox = document.querySelector('.audio');

export function getUserIDFromStorage() {
  let userID;
  if (window[storageName] && window[storageName].userID) {
    userID = window[storageName].userID;
  } else {
    userID = Date.now();
    window[storageName].userID = userID;
  }
  return userID;
}

export function updateUserNameInStorage(name) {
  if (window[storageName]) {
    window[storageName].name = name;
  }
}

export function getUserName() {
  let name = 'Anonymous';
  if (window[storageName] && window[storageName].name) {
    name = window[storageName].name;
  }
  return name;
}

export function handleNotFocusedPage() {
  if (!document.hasFocus()) {
    isOwlCheckbox.checked ? owlAudio.play() : defaultAudio.play();
    if (document.title !== title.NOT_FOCUSED) {
      document.title = title.NOT_FOCUSED;
      changeFavicon(notFocusedSource);
    }
  }
}

function changeFavicon(src) {
  const newLink = document.createElement('link');
  const oldLink = document.querySelector('link[rel="shortcut icon"]');

  newLink.rel = 'shortcut icon';
  newLink.href = src;
  if (oldLink) {
    document.head.removeChild(oldLink);
  }
  document.head.appendChild(newLink);
}

export function activatePageTitleChangingAfterFocus() {
  window.addEventListener('focus', () => {
    document.title = title.FOCUSED;
    changeFavicon(defaultSource);
  });
}
