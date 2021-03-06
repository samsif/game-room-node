import express from 'express';
import { ROOM_URL } from '../../../constants/api.constant';
import { roomService } from '../../../services/rooms/http/room.service';
import { errorHandlingService } from '../../../services/common-http/error-handling.service';
import { ADD_NEW_ROOM_LOG, DELETE_ROOM_BY_ID, GET_ROOMS_BY_PAGE_LOG, INAUTHORIZED_CONNECTION_LOG } from '../../../constants/logs.constant';
import bodyParser from 'body-parser';
import { INAUTHORIZED_CODE } from '../../../constants/errors-code.constant';
import { IRoom } from '../../../repository/db-models/room-repo.model';

const roomCrudServer = express();
const jsonParse = bodyParser.json();

/** Add new room */
roomCrudServer.post(ROOM_URL, jsonParse, (req, res) => {
  const request: IRoom = req.body;
  roomService.addRoom(request, req.headers.authorization)
  .then(room => {
    res.send(room);
    console.log(ADD_NEW_ROOM_LOG);
  }).catch(error => {
    return errorHandlingService.getDbErrorResponse(res, error)
  })
});

/** Get rooms list */
roomCrudServer.get(ROOM_URL, jsonParse, (req, res) => {
  roomService.getRoomsByPage(+req.query.start, +req.query.end).then(roomsResult => {
    res.send(roomsResult);
    console.log(GET_ROOMS_BY_PAGE_LOG);
  }).catch(err => {
    return errorHandlingService.getDbErrorResponse(res, err);
  })
});

/** Delete room by id */
roomCrudServer.delete(ROOM_URL, jsonParse, (req, res) => {
  roomService.deleteRoomById(req.query.id.toString(), req.query.user.toString()).then(deletedRoom => {
    if (deletedRoom) {
      res.send(deletedRoom);
      console.log(DELETE_ROOM_BY_ID);
    } else {
      console.log(INAUTHORIZED_CONNECTION_LOG);
      return errorHandlingService.getResponse(res, Error(INAUTHORIZED_CODE));
    }
  }).catch(err => {
    return errorHandlingService.getDbErrorResponse(res, err);
  });
});

export {roomCrudServer}
