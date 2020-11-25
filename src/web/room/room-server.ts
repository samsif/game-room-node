import bodyParser from 'body-parser';
import { errorHandlingService } from '../../services/common-http/error-handling.service';
import express from 'express';
import { roomUrl } from '../server-urls';
import { RoomDto } from '../../dto/room/room.dto';
import { roomService } from '../../services/rooms/http/room.service';
import { RoomsResultDto } from '../../dto/room/rooms-result.dto';
import { ADD_NEW_ROOM_LOG, DELETE_ROOM_BY_ID, GET_ROOMS_BY_PAGE_LOG } from '../../constants/logs.constant';

const roomServer = express();
const jsonParse = bodyParser.json();

/** Add new room */
roomServer.post(roomUrl, jsonParse, (req, res) => {
  const request: RoomDto = req.body;
  let response: RoomDto;
  try {
    response = roomService.addRoom(request, req.headers.authorization);
  } catch (err) {
    return errorHandlingService.getResponse(res, err);
  }
  console.log(ADD_NEW_ROOM_LOG);
  res.send(response);
});

/** Get rooms list */
roomServer.get(roomUrl, jsonParse, (req, res) => {
  let response: RoomsResultDto;
  try {
    response = roomService.getRoomsByPage(+req.query.start, +req.query.end);
  } catch (err) {
    return errorHandlingService.getResponse(res, err);
  }
  console.log(GET_ROOMS_BY_PAGE_LOG);
  res.send(response);
});

/** Delete room by id */
roomServer.delete(roomUrl, jsonParse, (req, res) => {
  let response: RoomsResultDto;
  try {
    response = roomService.deleteRoomById(+req.query.id, req.query.user.toString());
  } catch (err) {
    return errorHandlingService.getResponse(res, err);
  }
  console.log(DELETE_ROOM_BY_ID);
  res.send(response);
});

export {roomServer};