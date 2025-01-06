import { Router } from "express";
import {
  createRoom,
  createRoomtypes,
  editRoomtypes,
  findAllRoomtypes,
  findAllRoomtypesAdmins,
  getRoomsLocations,
  roomfindAdmin,
  showRoomsWithTypes,
  singleRoomDetails,
  updateRoom,
} from "../Controllers/room.controller.js";
import { adminOnly, authenticateTokenUser } from "../Middleware/tokenverify.js";
import { upload } from "../Middleware/multer.js";

const roomRouter = Router();

// roomRouter.get("/noofrooms/:id", avaialableRooms);
roomRouter.post("/", getRoomsLocations);
roomRouter.get("/get", adminOnly, roomfindAdmin);
roomRouter.get("/get/one/room/:id", authenticateTokenUser, singleRoomDetails);
roomRouter.post(
  "/create/room",
  adminOnly,
  upload.fields([
    { name: "room_image_1" },
    { name: "room_image_2" },
    { name: "room_image_3" },
    { name: "room_image_4" },
    { name: "room_image_5" },
    { name: "room_image_6" },
  ]),
  createRoom
);
roomRouter.patch(
  "/update/room/:id",
  adminOnly,
  upload.fields([
    { name: "room_image_1" },
    { name: "room_image_2" },
    { name: "room_image_3" },
    { name: "room_image_4" },
    { name: "room_image_5" },
    { name: "room_image_6" },
  ]),
  updateRoom
);

//roomtypes

roomRouter.get("/type/get/all", adminOnly, findAllRoomtypes);
roomRouter.get("/type/get/admin/all", adminOnly, findAllRoomtypesAdmins);
roomRouter.post("/type/create/type", adminOnly, createRoomtypes);
roomRouter.patch("/type/edit/room/type/:id", adminOnly, editRoomtypes);

//Room with Types & Locations
roomRouter.post("/get/all/rooms/admin", adminOnly, showRoomsWithTypes);
export { roomRouter };
