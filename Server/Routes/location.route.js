import { Router } from "express";
import { adminOnly, authenticateTokenUser } from "../Middleware/tokenverify.js";
import {
  createLocation,
  editLocation,
  getLocation,
  getLocations,
  getLocationsAdmin,
} from "../Controllers/location.controller.js";

const locationRouter = Router();

locationRouter.post("/create/location", adminOnly, createLocation);
locationRouter.get("/get/:id", authenticateTokenUser, getLocation);
locationRouter.get("/get/user/location", getLocations);
locationRouter.get("/get/admin/location", adminOnly, getLocationsAdmin);
locationRouter.patch("/edit/location/:id", adminOnly, editLocation);

export { locationRouter };
