import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';

export const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { currentChannel, setIsPlaying: setStoreIsPlaying } = useStore();

  useEffect(() => {
    if (currentChannel && videoRef.current) {
      loadChannel();
    }
  }, [currentChannel]);

  const loadChannel = async () => {
    if (!currentChannel || !videoRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const video = videoRef.current;
      
      // Demo mode - simulate loading
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Use a demo video for preview
      video.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      video.load();
      
      setIsPlaying(true);
      setStoreIsPlaying(true);
      setIsLoading(false);
    } catch (err) {
      setError('Demo mode - Stream simulation');
      setIsLoading(false);
      console.error('Video load error:', err);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;

    try {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    } catch (err) {
      console.log('Demo mode - video control simulation');
    }
    setIsPlaying(!isPlaying);
    setStoreIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (newVolume: number) => {
    if (!videoRef.current) return;

    videoRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  if (!currentChannel) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-12 h-12 text-white ml-1" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Select a Channel</h3>
          <p className="text-gray-400">Choose a country and channel to start watching</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="relative w-full h-full bg-black rounded-2xl overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onLoadStart={() => setIsLoading(true)}
        onLoadedData={() => setIsLoading(false)}
        onError={() => setError('Stream unavailable')}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-60 animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <VolumeX className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Stream Error</h3>
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
      )}

      {/* Channel Info Overlay */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-60 backdrop-blur-md rounded-lg px-4 py-2">
        <div className="flex items-center space-x-3">
          {currentChannel.logo && (
            <img
              src={currentChannel.logo}
              alt={currentChannel.name}
              className="w-8 h-8 rounded"
            />
          )}
          <div>
            <h3 className="text-white font-semibold">{currentChannel.name}</h3>
            <p className="text-gray-300 text-sm">{currentChannel.country} • {currentChannel.category}</p>
          </div>
        </div>
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200">
              <Settings className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200"
            >
              <Maximize className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};