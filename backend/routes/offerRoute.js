import express from 'express';
import { addOffer, deleteOffer, getOffers } from '../controllers/offerController.js';

const offerRouter = express.Router();

offerRouter.post('/offer-add', addOffer);
offerRouter.get('/offer-get', getOffers);
offerRouter.delete('/offer-delete/:id', deleteOffer);

export default offerRouter;