const store = [];

const MAX_STORE_LENTGH = 10;

const addToStore = data => {
  store.push(data);
  if (store.length > MAX_STORE_LENTGH) {
    store.shift();
  }
};

module.exports = {
  store: store,
  addToStore: addToStore
};
