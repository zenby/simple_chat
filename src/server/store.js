export const store = [];

const MAX_STORE_LENGTH = 10;

export const addToStore = data => {
  store.push(data);
  if (store.length > MAX_STORE_LENGTH) {
    store.shift();
  }
};
