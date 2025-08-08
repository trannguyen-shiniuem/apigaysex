import React from 'react';

const Playlist = () => {
  return (
    <div className="fade-in">
      <div className="card mb-8">
        <div className="flex gap-6">
          <div className="w-48 h-48 bg-border-color rounded-lg flex-shrink-0"></div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">Playlist Name</h1>
            <p className="text-secondary mb-4">by Creator Name</p>
            <p className="mb-4">Playlist description goes here...</p>
            <div className="flex items-center gap-4 mb-6">
              <button className="btn btn-primary">
                <i className="fas fa-play mr-2"></i>
                Play All
              </button>
              <button className="btn btn-ghost">
                <i className="fas fa-heart mr-2"></i>
                Like
              </button>
            </div>
            <div className="flex gap-6 text-sm text-secondary">
              <span>0 tracks</span>
              <span>0 likes</span>
              <span>0 followers</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center py-20">
        <i className="fas fa-list text-6xl text-light mb-4"></i>
        <h2 className="text-xl font-semibold mb-2">Empty playlist</h2>
        <p className="text-secondary">This playlist doesn't have any tracks yet</p>
      </div>
    </div>
  );
};

export default Playlist;