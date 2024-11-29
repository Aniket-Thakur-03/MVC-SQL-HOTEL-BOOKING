import { Router } from "express";
import {
  createUser,
  loginUser,
  verifyUserEmail,
} from "../Controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.patch("/verifyemail", verifyUserEmail);

export { userRouter };
