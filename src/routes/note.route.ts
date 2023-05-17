import express, { Router } from 'express';
import { NoteController } from '../controllers';
import { NoteValidation } from '../validations';
import { AsyncError } from '../errorhandlers';
import { userAuth, checkUserPermission } from '../middleware/auth';

const router: Router = express.Router();

router.route('/notes').post(
  userAuth,
  NoteValidation.validateNoteCreation,
  AsyncError(NoteController.createNote)
);

router.route('/notes').get(
  userAuth,
  AsyncError(NoteController.fetchNotes)
);

router.route('/notes/:id').get(
  userAuth,
  NoteValidation.validateNoteId,
  checkUserPermission,
  AsyncError(NoteController.fetchNote)
);

router.route('/notes/:id').put(
  userAuth,
  NoteValidation.validateNoteId,
  checkUserPermission,
  AsyncError(NoteController.updateNote)
);

router.route('/notes/:id/share').post(
  userAuth,
  NoteValidation.validateNoteShare,
  NoteValidation.validateNoteId,
  checkUserPermission,
  AsyncError(NoteController.shareNote)
);

router.route('/notes/:id').delete(
  userAuth,
  NoteValidation.validateNoteId,
  checkUserPermission,
  AsyncError(NoteController.deleteNote)
);

router.route('/search').get(
  userAuth,
  AsyncError(NoteController.searchNote)
);

export default router