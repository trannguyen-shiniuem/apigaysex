import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center py-20">
      <div className="text-8xl font-bold text-primary mb-4">404</div>
      <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
      <p className="text-secondary mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;