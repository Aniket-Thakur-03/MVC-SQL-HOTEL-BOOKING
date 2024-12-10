import {Router} from "express";
import { adminOnly, authenticateTokenUser } from "../Middleware/tokenverify.js";
import { activeUpdateState, addState, deleteState, editState, readState } from "../Controllers/state.controller.js";

const stateRouter = Router();

stateRouter.get("/get",authenticateTokenUser,readState);
stateRouter.post("/create/state",adminOnly,addState);
stateRouter.patch("/edit/state/:id",adminOnly,editState);
stateRouter.patch("/edit/active/:id",adminOnly,activeUpdateState);
stateRouter.delete("/delete/state/:id",adminOnly,deleteState);

export {stateRouter}