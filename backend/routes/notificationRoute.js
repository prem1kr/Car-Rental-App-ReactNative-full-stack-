import express from 'express';
import { AddNotification, DeleteNotification, GetNotification, MarkedRead } from '../controllers/notificationController.js';

const notificationRouter = express.Router();

notificationRouter.post('/notification-add', AddNotification);
notificationRouter.get('/notification-get', GetNotification);
notificationRouter.delete('/notification-delete/:id', DeleteNotification);
notificationRouter.put('/notification-read/:id', MarkedRead );

export default notificationRouter;