export function getRoomName(roomID) {
  return roomID === '0' ? 'Main room' : `Room ${roomID}`;
}

export function getTime() {
  return new Date().toLocaleTimeString(undefined, { hour12: false });
}
