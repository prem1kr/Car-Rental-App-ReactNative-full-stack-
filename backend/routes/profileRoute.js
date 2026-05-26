import express from 'express';
import { GetProfile, ProfielEdit } from '../controllers/profileController.js';

const profileRouter = express.Router();

profileRouter.post('/profile-edit', ProfielEdit);
profileRouter.get('/profile-get', GetProfile);


export default profileRouter;
