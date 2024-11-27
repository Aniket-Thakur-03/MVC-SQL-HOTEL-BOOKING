import {Router} from 'express';
import { avaialableRooms } from '../Controllers/room.controller.js';

const roomRouter = Router();

roomRouter.get("/noofrooms/:id",avaialableRooms);

export {roomRouter};