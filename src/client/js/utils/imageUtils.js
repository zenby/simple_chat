// Check the existence of an image file at `url` by creating a
// temporary Image element. The `success` callback is called
// if the image loads correctly or the image is already complete.
// The `failure` callback is called if the image fails to load
// or has failed to load in the past.
export function checkImage(url, success) {
  var img = new Image(), // the
    loaded = false;

  // Run only once, when `loaded` is false. If `success` is a function, it is called with `img` as the context.
  img.onload = function() {
    if (loaded) {
      return;
    }

    loaded = true;

    if (success && success.call) {
      success.call(img);
    }
  };

  // Set the img src to trigger loading
  img.src = url;

  // If the image is already complete (i.e. cached), trigger the `onload` callback.
  if (img.complete) {
    img.onload.call(img);
  }
}
