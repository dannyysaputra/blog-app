import { Request, Response, NextFunction } from 'express';
import Post from '../models/Post.model';

// @desc    Create new post
// @route   POST /posts
// @access  Private
export const createPost = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { title, content, category } = req.body;

    const post = await Post.create({
      title,
      content,
      category,
      author: req.user._id,
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts (with Search & Pagination)
// @route   GET /posts
// @access  Public
export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    let query: any = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const posts = await Post.find(query)
      .populate('author', 'name email profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post
// @route   GET /posts/:id
// @access  Public
export const getPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Update post
// @route   PUT /posts/:id
// @access  Private (Author only)
export const updatePost = async (req: any, res: Response, next: NextFunction) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this post' });
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /posts/:id
// @access  Private (Author only)
export const deletePost = async (req: any, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();

    res.json({ success: true, message: 'Post removed' });
  } catch (error) {
    next(error);
  }
};
