import { Router } from "express";
import { adminOnly, authenticateTokenUser } from "../Middleware/tokenverify.js";
import {
  activeUpdateState,
  addState,
  deleteState,
  editState,
  getStateId,
  readState,
  readStateUser,
} from "../Controllers/state.controller.js";

const stateRouter = Router();

stateRouter.get("/get/:id", authenticateTokenUser, readState);
stateRouter.get("/get/active/:id", readStateUser);
stateRouter.get("/get/state/:id", authenticateTokenUser, getStateId);
stateRouter.post("/create/state", adminOnly, addState);
stateRouter.patch("/edit/state/:id", adminOnly, editState);
stateRouter.patch("/edit/active/:id", adminOnly, activeUpdateState);
stateRouter.delete("/delete/state/:id", adminOnly, deleteState);

export { stateRouter };
