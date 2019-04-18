export function checkImage(url, successCallback) {
  const img = new Image();
  let loaded = false;

  img.onload = function() {
    if (loaded) return;
    loaded = true;

    if (successCallback && successCallback.call) {
      successCallback.call(img);
    }
  };

  img.src = url;

  if (img.complete) {
    img.onload.call(img);
  }
}

export function getImageBySource(href) {
  const image = document.createElement('img');
  image.src = href;
  image.classList.add('user_image');

  return image;
}
