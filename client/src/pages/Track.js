import React from 'react';

const Track = () => {
  return (
    <div className="fade-in">
      <div className="card">
        <div className="flex gap-6 mb-8">
          <div className="w-48 h-48 bg-border-color rounded-lg flex-shrink-0"></div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">Track Title</h1>
            <p className="text-secondary mb-4">by Artist Name</p>
            <div className="flex items-center gap-4 mb-6">
              <button className="btn btn-primary">
                <i className="fas fa-play mr-2"></i>
                Play
              </button>
              <button className="btn btn-ghost">
                <i className="fas fa-heart mr-2"></i>
                Like
              </button>
              <button className="btn btn-ghost">
                <i className="fas fa-retweet mr-2"></i>
                Repost
              </button>
            </div>
            <div className="flex gap-6 text-sm text-secondary">
              <span>1,234 plays</span>
              <span>56 likes</span>
              <span>12 reposts</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border-color pt-6">
          <h3 className="font-semibold mb-4">Comments</h3>
          <div className="text-center py-8">
            <p className="text-secondary">No comments yet</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Track;