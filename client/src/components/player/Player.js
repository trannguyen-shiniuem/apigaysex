import React from 'react';
import { usePlayer } from '../../contexts/PlayerContext';

const Player = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    seekTo,
    changeVolume,
    toggleMute,
    formatTime
  } = usePlayer();

  if (!currentTrack) return null;

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seekTo(percent * duration);
  };

  const handleVolumeChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    changeVolume(percent);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card-background border-t border-border-color p-4 z-50">
      <div className="flex items-center gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <img
            src={currentTrack.artwork}
            alt={currentTrack.title}
            className="w-12 h-12 rounded object-cover"
          />
          <div className="min-w-0">
            <h4 className="font-medium truncate">{currentTrack.title}</h4>
            <p className="text-sm text-secondary truncate">
              {currentTrack.user?.displayName}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="flex items-center gap-4">
            <button className="btn btn-ghost p-2">
              <i className="fas fa-step-backward"></i>
            </button>
            
            <button
              onClick={togglePlay}
              className="btn btn-primary p-3 rounded-full"
            >
              <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
            </button>
            
            <button className="btn btn-ghost p-2">
              <i className="fas fa-step-forward"></i>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-xs text-secondary">
              {formatTime(currentTime)}
            </span>
            
            <div
              className="flex-1 h-1 bg-border-color rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-primary-color rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
            
            <span className="text-xs text-secondary">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
          <button onClick={toggleMute} className="btn btn-ghost p-2">
            <i className={`fas fa-volume-${isMuted ? 'mute' : volume > 0.5 ? 'up' : 'down'}`}></i>
          </button>
          
          <div
            className="w-20 h-1 bg-border-color rounded-full cursor-pointer"
            onClick={handleVolumeChange}
          >
            <div
              className="h-full bg-primary-color rounded-full"
              style={{ width: `${isMuted ? 0 : volume * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;