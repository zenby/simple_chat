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
    document.title = title.NOT_FOCUSED;
    audio.play();
  }
}

export function activatePageTitleChangingAfterFocus() {
  window.addEventListener('focus', () => {
    document.title = title.FOCUSED;
  });
}
