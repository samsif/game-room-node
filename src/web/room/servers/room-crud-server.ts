import express from 'express';
import { ROOM_URL } from '../../../constants/api-const';
import { RoomDto } from '../../../dto/room/room.dto';
import { roomService } from '../../../services/rooms/http/room.service';
import { errorHandlingService } from '../../../services/common-http/error-handling.service';
import { ADD_NEW_ROOM_LOG, ADD_NEW_USER_LOG, DELETE_ROOM_BY_ID, GET_ROOMS_BY_PAGE_LOG } from '../../../constants/logs.constant';
import { RoomsResultDto } from '../../../dto/room/rooms-result.dto';
import bodyParser from 'body-parser';

const roomCrudServer = express();
const jsonParse = bodyParser.json();

/** Add new room */
roomCrudServer.post(ROOM_URL, jsonParse, (req, res) => {
  const request: RoomDto = req.body;
  roomService.addRoom(request, req.headers.authorization).then(room => {
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
  let response: RoomsResultDto;
  try {
    response = roomService.deleteRoomById(+req.query.id, req.query.user.toString());
  } catch (err) {
    return errorHandlingService.getResponse(res, err);
  }
  console.log(DELETE_ROOM_BY_ID);
  res.send(response);
});

export {roomCrudServer}
