import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { postService } from '../services/post.service';
import { authService } from '../services/auth.service';
import type { Post } from '../types/post';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { motion } from 'framer-motion';
import { Camera, Loader2 } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [errorModal, setErrorModal] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) return;
      try {
        const response = await postService.getAll(1, 100); 
        if (response.success) {
            const userPosts = response.data.posts.filter((p: Post) => p.author._id === user._id);
            setPosts(userPosts);
        }
      } catch (err) {
        console.error('Failed to fetch posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);

      setIsUploading(true);
      try {
        await authService.uploadProfilePicture(formData);
        window.location.reload(); 
      } catch (error) {
        console.error('Failed to upload image', error);
        setErrorModal({ open: true, message: 'Failed to upload image. Please try again.' });
      } finally {
        setIsUploading(false);
      }
    }
  };

  if (isLoading) return <Loader />;

  const profilePicUrl = user?.profilePicture 
    ? `${import.meta.env.VITE_API_BASE_URL}${user.profilePicture}` 
    : null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-10 flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
              <div className="h-24 w-24 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold overflow-hidden border-4 border-white shadow-md">
                  {profilePicUrl ? (
                      <img src={profilePicUrl} alt={user?.name} className="w-full h-full object-cover" />
                  ) : (
                      <span>{user?.name.charAt(0).toUpperCase()}</span>
                  )}
              </div>
              <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                  {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
              </button>
              <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
              />
          </div>
          
          <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Stories</h2>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">{posts.length}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <PostCard key={post._id} post={post} index={index} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500 italic mb-4">You haven't published any stories yet.</p>
          </div>
        )}
      </motion.div>

      {/* Error Modal */}
      <Modal
        isOpen={errorModal.open}
        onClose={() => setErrorModal({ ...errorModal, open: false })}
        title="Error"
        type="error"
      >
        <p>{errorModal.message}</p>
      </Modal>
    </>
  );
};

export default Profile;
