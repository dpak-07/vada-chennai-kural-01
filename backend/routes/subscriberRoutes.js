import express from 'express';
import { subscribe, getSubscribers, broadcastIssue } from '../controllers/subscriberController.js';

const router = express.Router();

router.post('/subscribe', subscribe);
router.get('/', getSubscribers);
router.post('/broadcast', broadcastIssue);

export default router;