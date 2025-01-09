import { Router } from "express";
import { MulterError } from "multer";
import { excelUpload } from "../Middleware/multer.js";
import { adminOnly, authenticateTokenUser } from "../Middleware/tokenverify.js";
import {
  createLocation,
  editLocation,
  getLocation,
  getLocations,
  getLocationsAdmin,
  locationDetails,
} from "../Controllers/location.controller.js";

const locationRouter = Router();
locationRouter.post("/create/location",excelUpload.single("locationfile"),adminOnly, createLocation);
locationRouter.use((err, req, res, next) => {
  console.error("Error caught in middleware:", err.message); // Debugging

  if (err instanceof MulterError) {
    // Multer-specific errors
    return res.status(400).json({ message: "Only Excel files (.xls, .xlsx) are allowed" });
  } else if (err.message === 'Only Excel files(.xls,.xlsx) are allowed!') {
    // Custom file filter error
    return res.status(400).json({ message: err.message });
  }
  next();
});
locationRouter.get("/get/:id", getLocation);
locationRouter.get("/get/user/location", getLocations);
locationRouter.get("/get/admin/location", adminOnly, getLocationsAdmin);
locationRouter.patch("/edit/location/:id",adminOnly, editLocation);
locationRouter.get("/get/single/location/details/:id",adminOnly,locationDetails);

export { locationRouter };
