import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Post } from '../types/post';
import { Calendar, User } from 'lucide-react';

interface PostCardProps {
  post: Post;
  index: number;
}

const PostCard: React.FC<PostCardProps> = ({ post, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.01 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
    >
      <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-2">
            {post.author.profilePicture ? (
                <img 
                    src={`${import.meta.env.VITE_API_BASE_URL}${post.author.profilePicture}`} 
                    alt={post.author.name} 
                    className="w-4 h-4 rounded-full object-cover"
                />
            ) : (
                <User size={12} />
            )}
          {post.author.name}
        </span>
        {post.category && (
          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {post.category}
          </span>
        )}
      </div>

      <Link to={`/posts/${post._id}`}>
        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h2>
      </Link>
      
      <p className="text-gray-500 line-clamp-3 mb-4 text-sm leading-relaxed">
        {post.content}
      </p>

      <Link 
        to={`/posts/${post._id}`}
        className="text-sm font-medium text-black underline decoration-gray-300 underline-offset-4 hover:decoration-black transition-all"
      >
        Read Article
      </Link>
    </motion.div>
  );
};

export default PostCard;
