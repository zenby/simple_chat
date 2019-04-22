import { drawSmallTextWithMessage, drawSmallText } from './utils/drawUtils';
import { getRoomName } from './utils/stringUtils';

export function showMeActionMessage(data) {
  const { message, username } = data;
  const smallText = `${username} ${message}`;
  drawSmallText(smallText);
}

export function showUserMessage(data, userID) {
  const { username, time, roomID, message, id } = data;
  const smallText = `${username} ${time}:`;
  const isUserMessage = data.userID === userID;
  drawSmallTextWithMessage(smallText, message, id, isUserMessage);
}

export function showUserJoinRoomMessage(data, userID) {
  const user = data.userID === userID ? 'You' : data.username;
  const smallText = `${user} have joined ${getRoomName(data.roomID)}`;
  drawSmallText(smallText);
}
