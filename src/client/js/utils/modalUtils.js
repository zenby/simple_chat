const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal_img');
const close = document.querySelector('span.close');
const messages = document.querySelector('#messages');

function closeModal() {
  modal.style.display = 'none';
}

close.onclick = closeModal;
modal.onclick = closeModal;

export function getImageBySource(href) {
  const image = document.createElement('img');
  image.src = href;
  image.classList.add('user_image');

  return image;
}

messages.addEventListener('click', ev => {
  if (ev.target.tagName === 'IMG') {
    modal.style.display = 'flex';
    modalImg.src = ev.target.src;
  }
});
