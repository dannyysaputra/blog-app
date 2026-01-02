import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, User as UserIcon, LogOut, PenSquare, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef]);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center font-bold text-xl tracking-tighter">
              KIN<span className="text-blue-600 font-light">BLOG</span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link to="/" className="text-gray-500 hover:text-black px-3 py-2 text-sm font-medium transition-colors">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/posts/new" className="text-gray-500 hover:text-black px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2">
                  <PenSquare size={18} /> Write
                </Link>
                
                <div className="relative" ref={profileMenuRef}>
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)} 
                        className="flex items-center gap-2 text-sm font-medium focus:outline-none ml-2"
                    >
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold shadow-sm overflow-hidden border border-gray-200">
                            {user?.profilePicture ? (
                                <img 
                                    src={`${import.meta.env.VITE_API_BASE_URL}${user.profilePicture}`} 
                                    alt={user.name} 
                                    className="w-full h-full object-cover" 
                                />
                            ) : (
                                <span>{user?.name?.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.1 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 overflow-hidden ring-1 ring-black ring-opacity-5"
                            >
                                <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                                     <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                                     <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                </div>
                                <div className="py-1">
                                    <Link 
                                        to="/profile" 
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2" 
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <UserIcon size={16} /> Profile
                                    </Link>
                                    <button 
                                        onClick={handleLogout} 
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-500 hover:text-black px-3 py-2 text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-t border-gray-100 bg-white"
          >
            <div className="pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-black hover:bg-gray-50">Home</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/posts/new" className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-black hover:bg-gray-50">Write Post</Link>
                  <Link to="/profile" className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-black hover:bg-gray-50">Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-base font-medium text-red-500 hover:text-red-700 hover:bg-gray-50">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-black hover:bg-gray-50">Login</Link>
                  <Link to="/register" className="block px-3 py-2 text-base font-medium text-black font-bold hover:bg-gray-50">Register</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;