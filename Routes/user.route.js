import {Router} from 'express';
import { createUser, loginUser } from '../Controllers/user.controller.js';

const userRouter = Router();

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);

export {userRouter};