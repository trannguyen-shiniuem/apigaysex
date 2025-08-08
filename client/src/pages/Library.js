import React from 'react';

const Library = () => {
  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Library</h1>
        <p className="text-secondary">Your tracks, playlists, and liked music</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <i className="fas fa-music text-4xl text-primary mb-4"></i>
          <h3 className="font-semibold mb-2">Your Tracks</h3>
          <p className="text-secondary text-sm mb-4">0 tracks</p>
        </div>
        
        <div className="card text-center">
          <i className="fas fa-list text-4xl text-primary mb-4"></i>
          <h3 className="font-semibold mb-2">Playlists</h3>
          <p className="text-secondary text-sm mb-4">0 playlists</p>
        </div>
        
        <div className="card text-center">
          <i className="fas fa-heart text-4xl text-primary mb-4"></i>
          <h3 className="font-semibold mb-2">Liked Tracks</h3>
          <p className="text-secondary text-sm mb-4">0 tracks</p>
        </div>
      </div>
    </div>
  );
};

export default Library;