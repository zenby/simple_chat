const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal_img');

export function closeModal() {
  modal.style.display = 'none';
}

export function modalPopupOnImageClick(ev) {
  if (
    ev.target.tagName === 'IMG' &&
    ev.target.classList.contains('message_image')
  ) {
    modal.style.display = 'flex';
    modalImg.src = ev.target.src;
  }
}
