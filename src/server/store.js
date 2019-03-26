export const store = [];
export let users = [];

const MAX_STORE_LENGTH = 10;

export const addToStore = data => {
  store.push(data);
  if (store.length > MAX_STORE_LENGTH) {
    store.shift();
  }
};

export const addToUsers = (id, username) => {
  const findedUser = users.find(user => user.id === id);

  if (findedUser) {
    findedUser.username = username;
  } else {
    users.push({ id, username });
  }
};

export const removeFromUsers = id => {
  users = users.filter(user => user.id !== id);
};
