import { Router } from 'express';
import {
  addComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
} from '../controllers/comment.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router({ mergeParams: true });

router.route('/').post(protect, addComment).get(getCommentsByPost);
router.route('/:id').put(protect, updateComment).delete(protect, deleteComment);

export default router;
