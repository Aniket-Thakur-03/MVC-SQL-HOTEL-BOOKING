import { Router } from "express";
import { adminOnly, authenticateTokenUser } from "../Middleware/tokenverify.js";
import {
  activeUpdateCity,
  addCity,
  deleteCity,
  editCity,
  getCityId,
  readCity,
  readCityUser,
} from "../Controllers/city.controller.js";

const cityRouter = Router();

cityRouter.get("/get/:id", authenticateTokenUser, readCity);
cityRouter.get("/get/active/:id", readCityUser);
cityRouter.get("/get/city/:id", authenticateTokenUser, getCityId);
cityRouter.post("/create/city", adminOnly, addCity);
cityRouter.patch("/edit/city/:id", adminOnly, editCity);
cityRouter.patch("/edit/active/:id", adminOnly, activeUpdateCity);
cityRouter.delete("/delete/city/:id", adminOnly, deleteCity);

export { cityRouter };
