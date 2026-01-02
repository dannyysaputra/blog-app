import React from 'react';
import type { Comment } from '../types/comment';
import { useAuth } from '../hooks/useAuth';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface CommentItemProps {
  comment: Comment;
  onDelete: (id: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onDelete }) => {
  const { user } = useAuth();
  const isAuthor = user?._id === comment.author._id;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className={`p-4 rounded-lg mb-3 ${
        isAuthor ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-100'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-sm">{comment.author.name}</span>
          <span className="text-xs text-gray-400">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        {isAuthor && (
          <button
            onClick={() => onDelete(comment._id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
    </motion.div>
  );
};

export default CommentItem;
