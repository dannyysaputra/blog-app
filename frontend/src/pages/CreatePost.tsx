import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { postService } from '../services/post.service';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  category: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const content = watch('content');

  const onSubmit = async (data: PostFormData) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await postService.create(data);
      if (response.success) {
        navigate(`/posts/${response.data._id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Write a new story</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Enter a captivating title..."
            {...register('title')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 text-lg shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category (Optional)</label>
          <input
            id="category"
            type="text"
            placeholder="e.g. Technology, Lifestyle..."
            {...register('category')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'write' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Write
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'preview' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Preview
                </button>
            </div>
          </div>
          
          {activeTab === 'write' ? (
            <textarea
                id="content"
                rows={12}
                placeholder="Tell your story... (Markdown supported)"
                {...register('content')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-base leading-relaxed resize-y font-mono text-sm"
            />
          ) : (
            <div className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-8 py-6 min-h-[300px] prose prose-sm max-w-none">
                {content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                ) : (
                    <p className="text-gray-400 italic">Nothing to preview yet...</p>
                )}
            </div>
          )}
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
          <p className="mt-2 text-xs text-gray-500">
            Styling with Markdown is supported. Use **bold**, *italics*, # headers, and more.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Publish'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreatePost;
