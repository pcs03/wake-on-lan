import { Router } from 'express';
import { getMe, loginUser, registerUser } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const userRouter = Router();

userRouter.post('/', registerUser);
userRouter.get('/login', loginUser);
userRouter.get('/me', protect, getMe);

export default userRouter;
