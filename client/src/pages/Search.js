import React from 'react';

const Search = () => {
  return (
    <div className="fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search for tracks, artists, playlists..."
              className="form-input"
            />
          </div>
          <button className="btn btn-primary">
            <i className="fas fa-search"></i>
            Search
          </button>
        </div>
        
        <div className="flex gap-2 mb-6">
          <button className="btn btn-secondary btn-sm">All</button>
          <button className="btn btn-ghost btn-sm">Tracks</button>
          <button className="btn btn-ghost btn-sm">Artists</button>
          <button className="btn btn-ghost btn-sm">Playlists</button>
        </div>
      </div>
      
      <div className="text-center py-20">
        <i className="fas fa-search text-6xl text-light mb-4"></i>
        <h2 className="text-xl font-semibold mb-2">Search for music</h2>
        <p className="text-secondary">
          Find tracks, artists, and playlists
        </p>
      </div>
    </div>
  );
};

export default Search;