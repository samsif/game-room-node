import express from 'express';
import { ROOM_ACCESS_URL } from '../../../constants/api.constant';
import { roomService } from '../../../services/rooms/http/room.service';
import { errorHandlingService } from '../../../services/common-http/error-handling.service';
import { ADD_USER_TO_ROOM_LOG, REMOVE_USER_FROM_ROOM_LOG } from '../../../constants/logs.constant';
import bodyParser from 'body-parser';
import { NOT_FOUND_CODE } from '../../../constants/errors-code.constant';

const roomAccessServer = express();
const jsonParse = bodyParser.json();

/** Add user to room */
roomAccessServer.post(ROOM_ACCESS_URL+ '/:roomId', jsonParse, (req, res) => {
  roomService.addUserToRoom(req.params.roomId, req.headers.authorization).then(room => {
    if (room) {
      res.send(room);
      console.log(ADD_USER_TO_ROOM_LOG);
    } else {
      console.log(NOT_FOUND_CODE);
      return errorHandlingService.getResponse(res, Error(NOT_FOUND_CODE));
    }
  }).catch(err => {return errorHandlingService.getDbErrorResponse(res, err);})
});

/** Remove user from room */
roomAccessServer.delete(ROOM_ACCESS_URL+ '/:roomId', jsonParse, (req, res) => {
  roomService.removeUserFromRoom(req.params.roomId, req.headers.authorization).then(response => {
    if (response) {
      res.send(response);
      console.log(REMOVE_USER_FROM_ROOM_LOG);
    } else {
      console.log(NOT_FOUND_CODE);
      return errorHandlingService.getResponse(res, Error(NOT_FOUND_CODE));
    }
  }).catch(err => {return errorHandlingService.getDbErrorResponse(res, err);})
});

export {roomAccessServer}
