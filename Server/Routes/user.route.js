import { Router } from "express";
import {
  checkLocation,
  createAdmin,
  createUser,
  loginUser,
  resetPassword,
  resetPasswordToken,
  sendforgetPassword,
  sendInfo,
  showAdmins,
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
import { adminOnly, authenticateTokenUser } from "../Middleware/tokenverify.js";

const userRouter = Router();

userRouter.post("/register", userCreateCheck, createUser);
userRouter.post("/login", loginInfoCheck, loginUser);
userRouter.patch("/verifyemail", verifyUserEmail);
userRouter.post(
  "/verify/password",
  authenticateTokenUser,
  verifypassword,
  verifyPassword
);
userRouter.post("/send/reset/password", sendforgetPassword);
userRouter.get("/forget/password/:id", resetPasswordToken);
userRouter.get("/get/profile", authenticateTokenUser, sendInfo);
userRouter.post("/forget/password", verifypassword, resetPassword);
userRouter.patch(
  "/update/info/:id",
  authenticateTokenUser,
  userUpdateCheck,
  updateUserInfo
);

//Admin Routes

userRouter.post("/admin/register", adminOnly, createAdmin);
userRouter.get("/admin/get", adminOnly, showAdmins);
userRouter.post("/admin/check/location", adminOnly, checkLocation);

export { userRouter };
