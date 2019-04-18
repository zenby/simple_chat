import defaultSource from '../../img/lizard.png';
import notFocusedSource from '../../img/lizard2.png';

const pageTitle = {
  FOCUSED: 'Chat',
  NOT_FOCUSED: '* Chat'
};
const defaultAudio = document.querySelector('.tink');
const owlAudio = document.querySelector('.owl');
const isOwlCheckbox = document.querySelector('.audio');

export function handleNotFocusedPage() {
  if (!document.hasFocus()) {
    const audio = isOwlCheckbox.checked ? owlAudio : defaultAudio;
    audio.play();
    if (document.title !== pageTitle.NOT_FOCUSED) {
      document.title = pageTitle.NOT_FOCUSED;
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
    document.title = pageTitle.FOCUSED;
    changeFavicon(defaultSource);
  });
}
