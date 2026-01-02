import { Response, NextFunction } from 'express';
import User from '../models/User.model';

// @desc    Upload profile picture
// @route   POST /users/profile/upload
// @access  Private
export const uploadProfilePicture = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const profilePictureUrl = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: profilePictureUrl },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
