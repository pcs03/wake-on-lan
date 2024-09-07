import { Router } from 'express';
import {
  wolDevice,
  shutdownDevice,
  pingDevice,
} from '../controllers/functionController';

const functionRouter = Router();

functionRouter.get('/wol/:id', wolDevice);
functionRouter.get('/shutdown/:id', shutdownDevice);
functionRouter.get('/ping/:id', pingDevice);

export default functionRouter;
