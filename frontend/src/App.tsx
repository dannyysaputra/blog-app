import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import EditPost from './pages/EditPost';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { AnimatePresence } from 'framer-motion';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/posts/new" element={<CreatePost />} />
          <Route path="/posts/:id/edit" element={<EditPost />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
          <Navbar />
          <main>
            <AnimatedRoutes />
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;