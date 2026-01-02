import { Router } from 'express';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} from '../controllers/post.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.route('/').get(getPosts).post(protect, createPost);
router.route('/:id').get(getPost).put(protect, updatePost).delete(protect, deletePost);

export default router;
