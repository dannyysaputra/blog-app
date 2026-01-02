import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../services/post.service';
import type { Post } from '../types/post';
import { useAuth } from '../hooks/useAuth';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen, PenTool, Search, ChevronLeft, ChevronRight } from 'lucide-react';

// Simple debounce implementation inside component or separate file. 
const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Pagination State
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await postService.getAll(page, 6, debouncedSearch);
        if (response.success) {
          setPosts(response.data.posts);
          setTotalPages(response.data.pagination.pages);
        }
      } catch (err) {
        setError('Failed to load posts');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [page, debouncedSearch]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 800, behavior: 'smooth' }); // Scroll to feed
    }
  };

  if (isLoading && page === 1 && !posts.length) return <Loader />;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-20 sm:py-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] pointer-events-none">
            <svg viewBox="0 0 1024 1024" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="512" cy="512" r="512" fill="url(#paint0_radial)" />
                <defs>
                    <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" transform="translate(512 512) rotate(90) scale(512)">
                        <stop stopColor="black" />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                    </radialGradient>
                </defs>
            </svg>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-6 border border-blue-100 uppercase tracking-wider"
            >
              <Sparkles size={14} /> 
              The future of blogging is here
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl mb-6"
            >
              Insights & <span className="text-blue-600">Perspectives</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto text-xl text-gray-500 mb-10 leading-relaxed"
            >
              Discover stories, thinking, and expertise from writers on any topic. 
              Join a community where curiosity meets depth.
            </motion.p>
            
            {!isAuthenticated ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row justify-center gap-4"
              >
                <Link 
                  to="/register" 
                  className="px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10 hover:shadow-black/20 transform hover:-translate-y-0.5"
                >
                  Start Reading <ArrowRight size={18} />
                </Link>
                <Link 
                  to="/login" 
                  className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Sign In
                </Link>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link 
                  to="/posts/new" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5"
                >
                  <PenTool size={18} /> Share Your Story
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Blog Feed Section */}
      <section className="bg-gray-50 py-20 min-h-[500px]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <BookOpen size={20} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Latest Stories</h2>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
                <input
                    type="text"
                    placeholder="Search articles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm"
                />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-center mb-8 font-medium">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-20">
                <Loader />
            </div>
          ) : (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {posts.map((post, index) => (
                    <PostCard key={post._id} post={post} index={index} />
                    ))}
                </div>

                {posts.length === 0 && !error && (
                    <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300"
                    >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
                        <BookOpen size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                        Try adjusting your search terms or check back later.
                    </p>
                    {isAuthenticated && search === '' && (
                        <Link 
                        to="/posts/new" 
                        className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all"
                        >
                        Write First Post
                        </Link>
                    )}
                    </motion.div>
                )}

                {/* Pagination */}
                {posts.length > 0 && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-sm font-medium text-gray-600">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </>
          )}
        </div>
      </section>

      {/* Footer / Callout */}
      {!isAuthenticated && (
        <section className="bg-white py-20">
            <div className="max-w-3xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Ready to join the conversation?</h2>
                <p className="text-gray-500 mb-10 text-lg">
                    Create an account today and start sharing your own perspectives with the world.
                </p>
                <Link 
                  to="/register" 
                  className="px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg"
                >
                  Join KinBlog
                </Link>
            </div>
        </section>
      )}
    </div>
  );
};

export default Home;
