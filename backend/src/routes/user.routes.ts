import { Router } from 'express';
import { uploadProfilePicture } from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.post('/profile/upload', protect, upload.single('image'), uploadProfilePicture);

export default router;
