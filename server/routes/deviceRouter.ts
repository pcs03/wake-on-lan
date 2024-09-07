import { Router } from 'express';
import {
  getDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  removeDevice,
} from '../controllers/deviceController';

const deviceRouter = Router();

deviceRouter.get('/', getDevices);
deviceRouter.get('/:id', getDeviceById);

deviceRouter.post('/', createDevice);

deviceRouter.put('/:id', updateDevice);

deviceRouter.delete('/:id', removeDevice);

export default deviceRouter;
