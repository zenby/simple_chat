const store = [];
let users = [];

const MAX_STORE_LENGTH = 10;

const addToStore = data => {
  store.push(data);
  if (store.length > MAX_STORE_LENGTH) {
    store.shift();
  }
};

const addToUsers = (id, username) => {
  const findedUser = users.find(user => user.id === id);

  if (findedUser) {
    findedUser.username = username;
  } else {
    users.push({ id, username });
  }
};

const removeFromUsers = id => {
  users = users.filter(user => user.id !== id);
};

module.exports = {
  store: store,
  users: users,
  addToStore: addToStore,
  addToUsers: addToUsers,
  removeFromUsers: removeFromUsers
};
