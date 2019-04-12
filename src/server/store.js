const store = [];
const MAX_STORE_LENGTH = 10;

const addToStore = data => {
  store.push(data);
  if (store.length > MAX_STORE_LENGTH) {
    store.shift();
  }
};

const addToUsers = (users, id, username) => {
  const findedUser = users.find(user => user.id === id);

  if (findedUser) {
    findedUser.username = username;
  } else {
    users.push({ id, username });
  }
  return users;
};

const removeFromUsers = (users, id) => {
  return users.filter(user => user.id !== id);
};

module.exports = {
  store: store,
  addToStore: addToStore,
  addToUsers: addToUsers,
  removeFromUsers: removeFromUsers
};
