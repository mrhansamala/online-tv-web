import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  X, Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  ExternalLink, AlertCircle, Loader2, RotateCcw, SkipBack, 
  Settings, Info, ChevronRight, Monitor
} from 'lucide-react';
import Hls from 'hls.js';
import { Stream } from '../types';

interface VideoPlayerProps {
  stream: Stream;
  onClose: () => void;
  isOpen: boolean;
}

export default function VideoPlayer({ stream, onClose, isOpen }: VideoPlayerProps) {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // 1. Initialize Stream & HLS
  useEffect(() => {
    if (!isOpen || !videoRef.current || !stream.url) return;

    const video = videoRef.current;
    setIsLoading(true);
    setError(null);

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    if (stream.url.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 60
        });

        hls.loadSource(stream.url);
        hls.attachMedia(video);
        hlsRef.current = hls;

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => setIsPlaying(false));
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.error("HLS Fatal Error:", data);
            setError("මෙම විකාශනය සජීවීව පෙන්වීමට නොහැක. (CORS හෝ Geo-restricted)");
            setIsLoading(false);
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream.url;
      }
    } else {
      video.src = stream.url;
    }

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [isOpen, stream]);

  // 2. Fullscreen Logic
  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // 3. Auto-hide Controls Logic
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  // 4. Player Actions
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuteStatus = !isMuted;
    setIsMuted(newMuteStatus);
    videoRef.current.muted = newMuteStatus;
    if (!newMuteStatus && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      containerRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    if (videoRef.current) videoRef.current.load();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-0 md:p-10">
      
      {/* Main Player Container */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className={`relative w-full max-w-6xl aspect-video bg-black shadow-2xl overflow-hidden group 
          ${isFullscreen ? 'w-screen h-screen max-w-none' : 'rounded-2xl border border-white/10'}`}
      >
        
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain pointer-events-none"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => setIsLoading(false)}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          autoPlay
          playsInline
        />

        {/* Loading Animation Overlay */}
        {isLoading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-20">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-white text-sm font-medium animate-pulse">Loading...</p>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 z-30 p-6 text-center">
            <div className="bg-red-500/20 p-4 rounded-full mb-4">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">ප්‍රවේශය අසාර්ථකයි</h3>
            <p className="text-gray-400 max-w-md mb-6">{error}</p>
            <div className="flex gap-4">
              <button 
                onClick={handleRetry}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all"
              >
                <RotateCcw className="w-4 h-4" /> නැවත උත්සාහ කරන්න
              </button>
              <button 
                onClick={() => window.open(stream.url, '_blank')}
                className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
              >
                <ExternalLink className="w-4 h-4" /> Browser එකේ බලන්න
              </button>
            </div>
          </div>
        )}

        {/* Header Controls (Title & Close) */}
        <div className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-500 z-40 flex items-center justify-between
          ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight truncate max-w-[200px] md:max-w-md">
                {stream.title}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <p className="text-gray-300 text-xs uppercase tracking-widest font-semibold">Live</p>
                {stream.quality && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-white/20 text-white rounded font-bold uppercase border border-white/10">
                    {stream.quality}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-red-500 text-white rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Big Play/Pause Center Button (Shown only on hover) */}
        {!isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`p-6 bg-blue-600/20 backdrop-blur-sm rounded-full border border-white/20 transition-all duration-300 transform
              ${showControls ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
              {isPlaying ? <Pause className="w-10 h-10 text-white fill-white" /> : <Play className="w-10 h-10 text-white fill-white translate-x-1" />}
            </div>
          </div>
        )}

        {/* Bottom Custom Controls */}
        <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 z-40
          ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
          
          <div className="flex flex-col gap-4">
            {/* Live Progress Bar (Fake but provides visual) */}
            <div className="relative h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="absolute h-full bg-blue-600 w-full animate-pulse" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Play/Pause */}
                <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-colors">
                  {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current" />}
                </button>

                {/* Volume Control */}
                <div className="flex items-center gap-3 group/vol">
                  <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors">
                    {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </button>
                  <input 
                    type="range" 
                    min="0" max="1" step="0.1" 
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 md:w-32 h-1 accent-blue-500 cursor-pointer opacity-0 group-hover/vol:opacity-100 transition-opacity"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Info Toggle */}
                <button 
                  onClick={() => setShowInfo(!showInfo)}
                  className={`p-2 rounded-lg transition-colors ${showInfo ? 'bg-blue-600 text-white' : 'text-white hover:bg-white/10'}`}
                >
                  <Info className="w-5 h-5" />
                </button>

                {/* External Link */}
                {/* <button 
                  onClick={() => window.open(stream.url, '_blank')}
                  className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Open Stream"
                >
                  <ExternalLink className="w-5 h-5" />
                </button> */}

                {/* Fullscreen Toggle */}
                <button onClick={toggleFullscreen} className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                  {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Info Panel (Slide-in) */}
        <div className={`absolute top-0 right-0 bottom-0 w-72 bg-gray-900/95 border-l border-white/10 z-50 p-6 transform transition-transform duration-300 ease-in-out
          ${showInfo ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-white font-bold flex items-center gap-2">
              <Settings className="w-4 h-4" /> Stream Info
            </h4>
            <button onClick={() => setShowInfo(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-black/50 p-3 rounded-xl border border-white/5">
              <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Channel ID</p>
              <p className="text-blue-400 text-xs font-mono break-all">{stream.channel || 'N/A'}</p>
            </div>
            
            <div className="bg-black/50 p-3 rounded-xl border border-white/5">
              <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Quality Status</p>
              <p className="text-green-400 text-xs font-semibold">{stream.quality || 'Auto Detection'}</p>
            </div>

            {stream.user_agent && (
              <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">User Agent Profile</p>
                <p className="text-gray-300 text-[11px] leading-relaxed italic truncate">{stream.user_agent}</p>
              </div>
            )}

            <div className="pt-4 border-t border-white/10">
              <p className="text-gray-500 text-[10px] mb-4">Devoloper</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-white/5 rounded text-[10px] text-gray-400">MR-Hansamala</span>
                {/* <span className="px-2 py-1 bg-white/5 rounded text-[10px] text-gray-400">AGE-21</span>
                <span className="px-2 py-1 bg-white/5 rounded text-[10px] text-gray-400">CONTACT-9478170673</span> */}
              </div>
            </div>
          </div>
        </div>

        {/* Darkened overlay for Info Panel */}
        {showInfo && (
          <div 
            onClick={() => setShowInfo(false)}
            className="absolute inset-0 bg-black/40 z-40"
          />
        )}
      </div>
    </div>
  );
}