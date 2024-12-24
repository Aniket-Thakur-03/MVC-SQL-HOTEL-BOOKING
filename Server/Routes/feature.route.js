import { Router } from "express";
import { adminOnly } from "../Middleware/tokenverify.js";
import { getFeatures } from "../Controllers/feature.controller.js";

const featureRouter = Router();

featureRouter.get("/get", adminOnly, getFeatures);

export { featureRouter };
