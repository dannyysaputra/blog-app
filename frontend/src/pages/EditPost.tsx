import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { postService } from '../services/post.service';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Loader from '../components/Loader';

const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  category: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const response = await postService.getById(id);
        if (response.success) {
          setValue('title', response.data.title);
          setValue('content', response.data.content);
          setValue('category', response.data.category);
        }
      } catch (err) {
        setError('Failed to load post data');
      } finally {
        setIsFetching(false);
      }
    };
    fetchPost();
  }, [id, setValue]);

  const onSubmit = async (data: PostFormData) => {
    if (!id) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await postService.update(id, data);
      if (response.success) {
        navigate(`/posts/${id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit story</h1>

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
            {...register('category')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            id="content"
            rows={12}
            {...register('content')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-base leading-relaxed resize-y"
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
        </div>

        <div className="flex justify-end gap-3">
            <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all"
            >
            Cancel
            </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Save Changes'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default EditPost;
