import { Router } from "express";
import { adminOnly, authenticateTokenUser } from "../Middleware/tokenverify.js";
import {
  activeUpdate,
  addCountry,
  deleteCountry,
  editCountry,
  getCountryId,
  readCountry,
  readCountryUser,
} from "../Controllers/country.controller.js";

const countryRouter = Router();

countryRouter.get("/get", authenticateTokenUser, readCountry);
countryRouter.get("/get/active", readCountryUser);
countryRouter.get("/get/country/:id", authenticateTokenUser, getCountryId);
countryRouter.post("/create/country", adminOnly, addCountry);
countryRouter.patch("/edit/country/:id", adminOnly, editCountry);
countryRouter.patch("/edit/active/:id", adminOnly, activeUpdate);
countryRouter.delete("/delete/country/:id", adminOnly, deleteCountry);

export { countryRouter };
