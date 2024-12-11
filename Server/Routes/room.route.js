import { Router } from "express";
import {
  avaialableRooms,
  createRoom,
  roomfind,
  roomfindAdmin,
  updateRoom,
} from "../Controllers/room.controller.js";
import { adminOnly } from "../Middleware/tokenverify.js";
import { upload } from "../Middleware/multer.js";

const roomRouter = Router();

roomRouter.get("/noofrooms/:id", avaialableRooms);
roomRouter.get("/", roomfind);
roomRouter.get("/get", adminOnly, roomfindAdmin);
roomRouter.post(
  "/create/room",
  adminOnly,
  upload.fields([{ name: "room_image_small" }, { name: "room_image_large" }]),
  createRoom
);
roomRouter.patch(
  "/update/room/:id",
  adminOnly,
  upload.fields([{ name: "room_image_small" }, { name: "room_image_large" }]),
  updateRoom
);

export { roomRouter };
