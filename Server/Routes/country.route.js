import {Router} from "express";
import {adminOnly,authenticateTokenUser} from "../Middleware/tokenverify.js";
import { activeUpdate, addCountry, deleteCountry, editCountry, readCountry } from "../Controllers/country.controller.js";

const countryRouter = Router();

countryRouter.get("/get",authenticateTokenUser,readCountry);
countryRouter.post("/create/country",adminOnly,addCountry);
countryRouter.patch("/edit/country/:id",adminOnly,editCountry);
countryRouter.patch("/edit/active/:id",adminOnly,activeUpdate);
countryRouter.delete("/delete/country/:id",adminOnly,deleteCountry);

export {countryRouter}