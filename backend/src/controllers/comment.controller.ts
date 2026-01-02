import { Request, Response, NextFunction } from 'express';
import Comment from '../models/Comment.model';

// @desc    Add comment to post
// @route   POST /posts/:id/comments
// @access  Private
export const addComment = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;

    const comment = await Comment.create({
      content,
      post: req.params.id,
      author: req.user._id,
    });

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments per post
// @route   GET /posts/:id/comments
// @access  Public
export const getCommentsByPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

// @desc    Update comment
// @route   PUT /comments/:id
// @access  Private (Author only)
export const updateComment = async (req: any, res: Response, next: NextFunction) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this comment' });
    }

    comment = await Comment.findByIdAndUpdate(req.params.id, { content: req.body.content }, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /comments/:id
// @access  Private (Author only)
export const deleteComment = async (req: any, res: Response, next: NextFunction) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();

    res.json({ success: true, message: 'Comment removed' });
  } catch (error) {
    next(error);
  }
};
