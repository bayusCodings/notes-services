import express, { Router } from 'express';
import UserRoute from './user.route';
import NoteRoute from './note.route';

const router: Router = express.Router();

router.use('/', UserRoute);
router.use('/', NoteRoute);

export default router;
