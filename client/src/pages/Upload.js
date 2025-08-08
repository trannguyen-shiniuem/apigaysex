import React from 'react';

const Upload = () => {
  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Upload Track</h1>
          <p className="card-subtitle">Share your music with the world</p>
        </div>
        
        <div className="text-center py-20">
          <i className="fas fa-upload text-6xl text-primary mb-4"></i>
          <h2 className="text-2xl font-bold mb-4">Upload Your Music</h2>
          <p className="text-secondary mb-8">
            Drag and drop your audio files here, or click to browse
          </p>
          <button className="btn btn-primary btn-lg">
            Choose Files
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upload;