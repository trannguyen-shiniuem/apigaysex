import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-16 h-full w-240 bg-card-background border-r border-border-color hidden lg:block">
      <div className="p-6">
        <nav className="space-y-2">
          <Link
            to="/"
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              isActive('/') ? 'bg-primary-color text-white' : 'text-secondary hover:bg-gray-100'
            }`}
          >
            <i className="fas fa-home"></i>
            <span>Home</span>
          </Link>
          
          <Link
            to="/discover"
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              isActive('/discover') ? 'bg-primary-color text-white' : 'text-secondary hover:bg-gray-100'
            }`}
          >
            <i className="fas fa-compass"></i>
            <span>Discover</span>
          </Link>
          
          <Link
            to="/search"
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              isActive('/search') ? 'bg-primary-color text-white' : 'text-secondary hover:bg-gray-100'
            }`}
          >
            <i className="fas fa-search"></i>
            <span>Search</span>
          </Link>
          
          {isAuthenticated && (
            <>
              <div className="border-t border-border-color my-4"></div>
              
              <Link
                to="/library"
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/library') ? 'bg-primary-color text-white' : 'text-secondary hover:bg-gray-100'
                }`}
              >
                <i className="fas fa-music"></i>
                <span>Your Library</span>
              </Link>
              
              <Link
                to="/upload"
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/upload') ? 'bg-primary-color text-white' : 'text-secondary hover:bg-gray-100'
                }`}
              >
                <i className="fas fa-upload"></i>
                <span>Upload</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;