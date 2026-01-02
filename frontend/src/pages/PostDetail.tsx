import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postService } from '../services/post.service';
import { commentService } from '../services/comment.service';
import type { Post } from '../types/post';
import type { Comment } from '../types/comment';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';
import CommentItem from '../components/CommentItem';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Send, Trash2, Edit2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, reset } = useForm<{ content: string }>();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [postRes, commentsRes] = await Promise.all([
          postService.getById(id),
          commentService.getByPostId(id)
        ]);

        if (postRes.success) setPost(postRes.data);
        if (commentsRes.success) setComments(commentsRes.data);
      } catch (err) {
        // setError('Failed to load post');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDeletePost = async () => {
    if (!id || !confirm('Are you sure you want to delete this post?')) return;
    try {
      await postService.delete(id);
      navigate('/');
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  const handleAddComment = async (data: { content: string }) => {
    if (!id || !data.content.trim()) return;
    try {
      const response = await commentService.create(id, data);
      if (response.success) {
        setComments([response.data, ...comments]);
        reset();
      }
    } catch (err) {
      alert('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await commentService.delete(commentId);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  if (isLoading) return <Loader />;
  if (!post) return <div className="text-center py-12">Post not found</div>;

  const isAuthor = user?._id === post.author._id;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-1" /> Back to posts
      </Link>

      <article className="prose prose-lg max-w-none">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <User size={14} />
            {post.author.name}
          </span>
          {post.category && (
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
              {post.category}
            </span>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
          {post.title}
        </h1>

        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap mb-12 text-lg">
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
            </ReactMarkdown>
          </div>
        </div>

        {isAuthor && (
          <div className="flex gap-4 border-t border-b border-gray-100 py-6 mb-12">
            <Link 
              to={`/posts/${post._id}/edit`}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Edit2 size={18} /> Edit Post
            </Link>
            <button 
              onClick={handleDeletePost}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <Trash2 size={18} /> Delete Post
            </button>
          </div>
        )}
      </article>

      <section className="max-w-2xl">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Comments ({comments.length})</h3>

        {isAuthenticated ? (
          <form onSubmit={handleSubmit(handleAddComment)} className="mb-10">
            <div className="flex gap-4">
              <textarea
                {...register('content', { required: true })}
                placeholder="Share your thoughts..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-black focus:outline-none focus:ring-1 focus:ring-black min-h-[100px] resize-y"
              />
            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 transition-colors"
              >
                <Send size={16} className="mr-2" /> Post Comment
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 mb-10 text-center">
            <p className="text-gray-600 mb-2">Join the discussion</p>
            <Link to="/login" className="text-black font-bold hover:underline">Log in to leave a comment</Link>
          </div>
        )}

        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem 
              key={comment._id} 
              comment={comment} 
              onDelete={handleDeleteComment} 
            />
          ))}
          {comments.length === 0 && (
            <p className="text-gray-500 italic">No comments yet.</p>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default PostDetail;
