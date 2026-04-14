'use client';

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, Download, Volume2, VolumeX } from 'lucide-react';

interface WaveformPlayerProps {
  url: string;
  onDownload?: () => void;
  fileName?: string;
}

export default function WaveformPlayer({ url, onDownload, fileName }: WaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#475569',
      progressColor: '#38bdf8',
      cursorColor: '#38bdf8',
      barWidth: 2,
      barRadius: 3,
      responsive: true,
      height: 60,
      normalize: true,
      partialRender: true,
    });

    wavesurfer.load(url);

    wavesurfer.on('ready', () => {
      setDuration(wavesurfer.getDuration());
    });

    wavesurfer.on('audioprocess', () => {
      setCurrentTime(wavesurfer.getCurrentTime());
    });

    wavesurfer.on('play', () => setIsPlaying(true));
    wavesurfer.on('pause', () => setIsPlaying(false));

    waveSurferRef.current = wavesurfer;

    return () => {
      wavesurfer.destroy();
    };
  }, [url]);

  const togglePlay = () => {
    waveSurferRef.current?.playPause();
  };

  const toggleMute = () => {
    waveSurferRef.current?.setMuted(!isMuted);
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="waveform-player">
      <div className="player-controls">
        <button className="play-btn" onClick={togglePlay}>
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
        </button>
        
        <div className="info">
          <span className="current">{formatTime(currentTime)}</span>
          <span className="total">/ {formatTime(duration)}</span>
        </div>
      </div>

      <div ref={containerRef} className="wave-container" />

      <div className="utility-controls">
        <button className="mute-btn" onClick={toggleMute}>
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        
        {onDownload && (
          <button className="download-btn" onClick={onDownload} title="Download Recording">
            <Download size={18} />
          </button>
        )}
      </div>

      <style jsx>{`
        .waveform-player {
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          width: 100%;
        }

        .player-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          min-width: 60px;
        }

        .play-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #38bdf8;
          color: #0f172a;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .play-btn:hover {
          transform: scale(1.05);
          background: #7dd3fc;
        }

        .info {
          font-size: 0.75rem;
          font-weight: 700;
          font-family: monospace;
          color: #94a3b8;
        }

        .wave-container {
          flex: 1;
          height: 60px;
        }

        .utility-controls {
          display: flex;
          gap: 0.75rem;
        }

        .mute-btn, .download-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mute-btn:hover, .download-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
      `}</style>
    </div>
  );
}
