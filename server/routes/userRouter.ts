import { Router } from 'express';
import {
  loginUser,
  registerUser,
} from '../controllers/userController';

const userRouter = Router();

userRouter.get("/", loginUser);
userRouter.post("/", registerUser);

export default userRouter;
