import { Router } from "express";
import {
  avaialableRooms,
  createRoom,
  roomfind,
  updateRoom,
} from "../Controllers/room.controller.js";
import { adminOnly } from "../Middleware/tokenverify.js";

const roomRouter = Router();

roomRouter.get("/noofrooms/:id", avaialableRooms);
roomRouter.get("/", roomfind);
roomRouter.get("/get", adminOnly, roomfind);
roomRouter.post("/create/room", createRoom);
roomRouter.patch("/update/room/:id", adminOnly, updateRoom);

export { roomRouter };
