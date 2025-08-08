import React from 'react';

const Discover = () => {
  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Music</h1>
        <p className="text-secondary">Explore trending tracks and new releases</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card">
            <div className="w-full h-48 bg-border-color rounded mb-4"></div>
            <h3 className="font-semibold mb-2">Track Title {i}</h3>
            <p className="text-secondary text-sm">Artist Name</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discover;