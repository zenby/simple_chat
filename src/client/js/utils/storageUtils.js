export function getUserIDFromStorage() {
  let userID;
  if (window.sessionStorage.userID) {
    userID = window.sessionStorage.userID;
  } else {
    userID = Date.now();
    window.sessionStorage.userID = userID;
  }
  return userID;
}

export function updateUserNameInStorage(name) {
  if (window.sessionStorage) {
    window.sessionStorage.name = name;
  }
}

export function getUserName() {
  let name = 'Anonymous';
  if (window.sessionStorage.name) {
    name = window.sessionStorage.name;
  } else if (window.localStorage.name) {
    name = window.localStorage.name;
  }
  return name;
}

export function saveUsernameOnExit(name) {
  window.localStorage.name = name;
}
