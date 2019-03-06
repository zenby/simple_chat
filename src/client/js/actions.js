import { drawSmallTextWithMessage, drawSmallText } from './utils/drawUtils';
import { getRoomName } from './utils/stringUtils';

export function showMeActionMessage(data) {
  const { message, username } = data;
  const smallText = `${username} ${message}`;
  drawSmallText(smallText);
}

export function showUserMessage(data, userID) {
  const { username, message, time, roomID } = data;
  const smallText = `${username}: ${time} ${getRoomName(roomID)}`;
  const isUserMessage = data.userID === userID;
  drawSmallTextWithMessage(smallText, message, isUserMessage);
}
