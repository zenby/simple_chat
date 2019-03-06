import defaultSource from '../../img/lizard.png';
import notFocusedSource from '../../img/lizard2.png';

const storageName = 'sessionStorage';
const title = {
  FOCUSED: 'Chat',
  NOT_FOCUSED: '* Chat'
};
const audio = document.querySelector('audio');

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

export function handleNotFocusedPage() {
  if (!document.hasFocus()) {
    audio.play();
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
