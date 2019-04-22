const fetch = require('node-fetch');

const URL = 'https://simple-chat-lizzard.firebaseio.com/saved-messages/.json';

function addSavedMessage(message) {
  return fetch(URL, {
    method: 'POST',
    body: JSON.stringify(message)
  }).then(data => data.json());
}

function getSavedMessages() {
  return fetch(URL)
    .then(res => res.json())
    .then(data => {
      if (!data) return [];
      const savedMessages = Object.values(data);
      const ids = Object.keys(data);

      return savedMessages.map((message, index) => {
        message.id = ids[index];
        return message;
      });
    });
}

function removeSavedMessage(id) {
  fetch(
    `https://simple-chat-lizzard.firebaseio.com/saved-messages/${id}.json`,
    { method: 'DELETE' }
  );
}

module.exports = {
  addSavedMessage,
  getSavedMessages,
  removeSavedMessage
};
