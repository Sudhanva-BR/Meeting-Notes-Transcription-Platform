'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw } from 'lucide-react';

interface MediaPlayerProps {
  currentTime: number;
  setCurrentTime: (time: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  duration: number; // in seconds
}

// Format duration from seconds to MM:SS
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Media player control panel containing timeline seek bars, volume levels, and audio controls
export const MediaPlayer = ({
  currentTime,
  setCurrentTime,
  isPlaying,
  setIsPlaying,
  duration,
}: MediaPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  // Sync isPlaying state with HTML audio node
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, setIsPlaying]);

  // Sync seeking time
  useEffect(() => {
    if (!audioRef.current) return;
    // Prevent infinite loop if diff is tiny
    if (Math.abs(audioRef.current.currentTime - currentTime) > 0.5) {
      audioRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  // Sync speed updates
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  // Sync volume updates
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Playback timer ticker
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekValue = parseFloat(e.target.value);
    setCurrentTime(seekValue);
    if (audioRef.current) {
      audioRef.current.currentTime = seekValue;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const skipForward = () => {
    const newTime = Math.min(currentTime + 10, duration);
    setCurrentTime(newTime);
  };

  const skipBackward = () => {
    const newTime = Math.max(currentTime - 10, 0);
    setCurrentTime(newTime);
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      {/* Hidden audio element pointing to sample MP3 or silent audio */}
      <audio
        ref={audioRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Public sample audio
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          // Keep metadata synced
        }}
      />

      {/* Seek Bar Slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          style={{
            flex: 1,
            accentColor: 'var(--accent-purple)',
            cursor: 'pointer',
            height: '4px',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: '2px',
          }}
        />
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
          {formatTime(duration)}
        </span>
      </div>

      {/* Buttons and volume row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        {/* Playback rate select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1.0x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2.0x</option>
          </select>
        </div>

        {/* Center Control Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={skipBackward}
            title="Rewind 10s"
            style={iconButtonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <RotateCcw size={16} />
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-purple)',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(124, 58, 237, 0.4)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-purple-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-purple)'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
          </button>

          <button
            onClick={skipForward}
            title="Fast Forward 10s"
            style={iconButtonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <RotateCw size={16} />
          </button>
        </div>

        {/* Volume controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={toggleMute}
            style={iconButtonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {isMuted ? <VolumeX size={16} color="var(--danger)" /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            style={{
              width: '70px',
              accentColor: 'var(--accent-purple)',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>
    </div>
  );
};

const iconButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  padding: '8px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
export default MediaPlayer;
