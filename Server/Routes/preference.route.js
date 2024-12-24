import { Router } from "express";
import { adminOnly } from "../Middleware/tokenverify.js";
import {
  allPreferences,
  assignLocation,
  editPreferences,
  seeAdminFeatures,
  showFeaturePreference,
} from "../Controllers/preference.controller.js";

const preferenceRouter = Router();

preferenceRouter.post("/assign/location", adminOnly, assignLocation);
preferenceRouter.get("/get/all", adminOnly, allPreferences);
preferenceRouter.patch("/edit/admin/preference", adminOnly, editPreferences);
preferenceRouter.post("/feature/get/admin", adminOnly, seeAdminFeatures);
preferenceRouter.post(
  "/search/feature/access/v1/admin",
  adminOnly,
  showFeaturePreference
);
export { preferenceRouter };
