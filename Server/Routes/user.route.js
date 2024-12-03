import { Router } from "express";
import {
  createUser,
  findUser,
  loginUser,
  updateUserInfo,
  verifyUserEmail,
} from "../Controllers/user.controller.js";
import {
  loginInfoCheck,
  userCreateCheck,
  userUpdateCheck,
} from "../Middleware/user.middleware.js";
import { authenticateTokenUser } from "../Middleware/tokenverify.js";

const userRouter = Router();

userRouter.post("/register", userCreateCheck, createUser);
userRouter.post("/login", loginInfoCheck, loginUser);
userRouter.patch("/verifyemail", verifyUserEmail);
userRouter.get("/find/user", authenticateTokenUser, findUser);
userRouter.patch(
  "/update/info/:id",
  authenticateTokenUser,
  userUpdateCheck,
  updateUserInfo
);

export { userRouter };
