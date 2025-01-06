import { Router } from "express";
import {
  addExtraServiceAdmin,
  editExtraServiceAdmin,
  getActiveExtraServices,
  getExtraServiceAdmin,
} from "../Controllers/extraservices.controller.js";
import { adminOnly } from "../Middleware/tokenverify.js";

const extraRouter = Router();

extraRouter.get("/get/all/extra/services/:id", adminOnly, getExtraServiceAdmin);
extraRouter.get(
  "/get/all/extra/active/services/:id",
  adminOnly,
  getActiveExtraServices
);
extraRouter.post("/create/extra/services", adminOnly, addExtraServiceAdmin);
extraRouter.patch(
  "/update/extra/services/:id",
  adminOnly,
  editExtraServiceAdmin
);

export { extraRouter };
