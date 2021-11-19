/* eslint-disable import/prefer-default-export */
export function validateChatRoomBody(req) {
  if (req.body.users === undefined || req.body.users.length === 0) {
    return false;
  }
}
