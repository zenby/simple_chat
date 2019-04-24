import { drawAction } from './utils/drawUtils';
import { getRoomName } from './utils/stringUtils';

export function showUserJoinRoomMessage(data, userID) {
  const user = data.userID === userID ? 'You' : data.username;
  const text = `${user} have joined ${getRoomName(data.roomID)}`;
  drawAction({ ...data, message: text });
}
