import express from 'express';
import auth from '../../app/middleware/auth';
import { SummaryController } from './summary.controller';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post('/generate', auth(USER_ROLE.admin, USER_ROLE.editor, USER_ROLE.reviewer, USER_ROLE.user), SummaryController.generateSummary);
router.get('/history', auth(), SummaryController.getUserSummaries);
router.patch('/:id', auth(), SummaryController.updateSummary);
router.delete('/:id', auth(), SummaryController.deleteSummary);

export const SummaryRoutes = router;