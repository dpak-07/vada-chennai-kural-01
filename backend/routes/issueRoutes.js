import express from 'express';
import { createIssue, getIssues } from '../controllers/issueController.js';

const router = express.Router();

router.route('/').post(createIssue).get(getIssues);

export default router;