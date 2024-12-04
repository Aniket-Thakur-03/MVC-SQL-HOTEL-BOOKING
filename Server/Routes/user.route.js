import { Router } from "express";
import {
  createUser,
  loginUser,
  updateUserInfo,
  verifyPassword,
  verifyUserEmail,
} from "../Controllers/user.controller.js";
import {
  loginInfoCheck,
  userCreateCheck,
  userUpdateCheck,
  verifypassword,
} from "../Middleware/user.middleware.js";
import { authenticateTokenUser } from "../Middleware/tokenverify.js";

const userRouter = Router();

userRouter.post("/register", userCreateCheck, createUser);
userRouter.post("/login", loginInfoCheck, loginUser);
userRouter.patch("/verifyemail", verifyUserEmail);
userRouter.post("/verify/password",authenticateTokenUser,verifypassword,verifyPassword);
userRouter.patch(
  "/update/info/:id",
  authenticateTokenUser,
  userUpdateCheck,
  updateUserInfo
);

export { userRouter };
