const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal_img');
const captionText = document.getElementById('caption');
const close = document.querySelector('span.close');

function closeModal() {
  modal.style.display = 'none';
}

close.onclick = closeModal;
modal.onclick = closeModal;

export function getStyledImage(href) {
  const image = document.createElement('img');
  image.src = href;
  image.classList.add('user_image');
  image.onclick = function() {
    modal.style.display = 'block';
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
  };
  return image;
}
