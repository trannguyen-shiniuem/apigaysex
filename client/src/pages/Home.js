import React from 'react';

const Home = () => {
  return (
    <div className="fade-in">
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Welcome to SoundCloud Clone
        </h1>
        <p className="text-xl text-secondary mb-8">
          Discover, upload, and share music with the world
        </p>
        <div className="flex gap-4 justify-center">
          <button className="btn btn-primary btn-lg">
            Start Listening
          </button>
          <button className="btn btn-secondary btn-lg">
            Upload Music
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;