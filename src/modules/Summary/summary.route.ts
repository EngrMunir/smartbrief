import express from 'express';
import auth from '../../app/middleware/auth';
import { SummaryController } from './summary.controller';
import { USER_ROLE } from '../User/user.constant';
import { upload } from '../../app/middleware/fileUpload';

const router = express.Router();

router.post(
  '/generate',
  auth(USER_ROLE.admin, USER_ROLE.editor, USER_ROLE.reviewer, USER_ROLE.user),
  SummaryController.generateSummary
);

router.post(
  '/upload',
  auth(USER_ROLE.admin, USER_ROLE.editor, USER_ROLE.user, USER_ROLE.reviewer),
  upload.single('file'),
  SummaryController.generateSummaryFromFile
);

router.post(
  '/reprompt/:id',
  auth(USER_ROLE.user, USER_ROLE.editor, USER_ROLE.admin),
  SummaryController.repromptSummary
);

router.get(
  '/history',
  auth(USER_ROLE.user, USER_ROLE.editor, USER_ROLE.reviewer),
  SummaryController.getUserSummaries
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.editor, USER_ROLE.reviewer),
  SummaryController.getAllSummaries
);

router.patch('/:id', auth(), SummaryController.updateSummary);

router.delete('/:id', auth(USER_ROLE.admin, USER_ROLE.editor, USER_ROLE.user), SummaryController.deleteSummary);

export const SummaryRoutes = router;
