export function getRoomName(roomID) {
  let roomName;

  switch (roomID) {
    case '0':
      roomName = 'Main channel';
      break;
    case '1':
      roomName = 'Stored messages';
      break;
    case '2':
      roomName = 'Private room';
    default:
      break;
  }
  return roomName;
}

export function getTime() {
  return new Date().toLocaleTimeString(undefined, { hour12: false });
}
