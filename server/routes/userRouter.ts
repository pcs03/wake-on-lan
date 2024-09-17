import { Router } from 'express';
import { getMe, loginUser, registerUser } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/me', protect, getMe);

export default userRouter;
