import { Router } from "express";
import { adminOnly, authenticateTokenUser } from "../Middleware/tokenverify.js";
import { activeUpdateCity, addCity, deleteCity, editCity, readCity } from "../Controllers/city.controller.js";

const cityRouter = Router();

cityRouter.get("/get", authenticateTokenUser, readCity);
cityRouter.post("/create/city", adminOnly, addCity);
cityRouter.patch("/edit/city/:id", adminOnly, editCity);
cityRouter.patch("/edit/active/:id", adminOnly, activeUpdateCity);
cityRouter.delete("/delete/city/:id", adminOnly, deleteCity);

export {cityRouter}