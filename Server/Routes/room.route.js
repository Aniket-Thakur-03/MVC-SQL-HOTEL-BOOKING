import { Router } from "express";
import {
  avaialableRooms,
  createRoom,
  roomfind,
} from "../Controllers/room.controller.js";

const roomRouter = Router();

roomRouter.get("/noofrooms/:id", avaialableRooms);
roomRouter.get("/", roomfind);
roomRouter.post("/create/room", createRoom);

export { roomRouter };
