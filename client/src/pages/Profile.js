import React from 'react';

const Profile = () => {
  return (
    <div className="fade-in">
      <div className="card mb-8">
        <div className="flex items-start gap-6">
          <div className="avatar avatar-xl flex-shrink-0"></div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">User Name</h1>
            <p className="text-secondary mb-4">@username</p>
            <p className="mb-4">User bio goes here...</p>
            <div className="flex items-center gap-6 text-sm text-secondary mb-4">
              <span>0 followers</span>
              <span>0 following</span>
              <span>0 tracks</span>
            </div>
            <button className="btn btn-primary">Follow</button>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex gap-2 border-b border-border-color">
          <button className="px-4 py-2 font-medium border-b-2 border-primary-color text-primary-color">
            Tracks
          </button>
          <button className="px-4 py-2 font-medium text-secondary">
            Playlists
          </button>
          <button className="px-4 py-2 font-medium text-secondary">
            Likes
          </button>
        </div>
      </div>
      
      <div className="text-center py-20">
        <i className="fas fa-music text-6xl text-light mb-4"></i>
        <h2 className="text-xl font-semibold mb-2">No tracks yet</h2>
        <p className="text-secondary">This user hasn't uploaded any tracks</p>
      </div>
    </div>
  );
};

export default Profile;