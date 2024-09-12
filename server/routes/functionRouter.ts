import { Router } from 'express';
import {
  wolDevice,
  shutdownDevice,
  pingDevice,
} from '../controllers/functionController';
import { protect } from '../middleware/authMiddleware';

const functionRouter = Router();

functionRouter.get('/wol/:id', protect, wolDevice);
functionRouter.get('/shutdown/:id', protect, shutdownDevice);
functionRouter.get('/ping/:id', protect, pingDevice);

export default functionRouter;
