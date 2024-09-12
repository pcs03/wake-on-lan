import { Router } from 'express';
import {
  getDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  removeDevice,
} from '../controllers/deviceController';
import { protect } from '../middleware/authMiddleware';

const deviceRouter = Router();

deviceRouter.get('/', protect, getDevices);
deviceRouter.get('/:id', protect, getDeviceById);

deviceRouter.post('/', protect, createDevice);

deviceRouter.put('/:id', protect, updateDevice);

deviceRouter.delete('/:id', protect, removeDevice);

export default deviceRouter;
