import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-card-background border-b border-border-color z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-color rounded"></div>
            <span className="text-xl font-bold">SoundCloud Clone</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/upload" className="btn btn-primary btn-sm">
                  Upload
                </Link>
                <div className="flex items-center gap-2">
                  <img 
                    src={user?.avatar} 
                    alt={user?.displayName}
                    className="avatar avatar-sm"
                  />
                  <span className="text-sm font-medium">{user?.displayName}</span>
                </div>
                <button onClick={logout} className="btn btn-ghost btn-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;