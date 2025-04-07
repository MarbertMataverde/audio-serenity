
import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const AudioPlayer = () => {
  const { 
    currentAudiobook, 
    isPlaying, 
    duration, 
    currentTime, 
    volume,
    togglePlayPause, 
    seek, 
    setVolume 
  } = useAudioPlayer();
  
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);
  
  useEffect(() => {
    // Close volume control when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.volume-control')) {
        setShowVolumeControl(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  if (!currentAudiobook) return null;
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const handleVolumeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowVolumeControl(!showVolumeControl);
  };
  
  const handleMuteToggle = () => {
    if (isMuted) {
      setVolume(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-3 shadow-lg">
      <div className="container-custom mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Book info */}
        <div className="flex items-center space-x-3 overflow-hidden">
          <img 
            src={currentAudiobook.cover_url}
            alt={currentAudiobook.title}
            className="h-12 w-12 rounded-md object-cover"
          />
          <div className="truncate">
            <p className="font-medium text-sm truncate">{currentAudiobook.title}</p>
            <p className="text-xs text-muted-foreground truncate">{currentAudiobook.author}</p>
          </div>
        </div>
        
        {/* Playback controls */}
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SkipBack size={18} />
            </Button>
            <Button 
              onClick={togglePlayPause} 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SkipForward size={18} />
            </Button>
          </div>
          
          <div className="flex items-center w-full space-x-2 mt-1">
            <span className="text-xs">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={(value) => seek(value[0])}
              className="flex-1"
            />
            <span className="text-xs">{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Volume control */}
        <div className="flex justify-end relative">
          <div className="volume-control">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handleVolumeClick}
            >
              {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </Button>
            
            {showVolumeControl && (
              <div className="absolute right-0 bottom-12 bg-white dark:bg-gray-900 p-4 rounded-md shadow-md border border-gray-200 dark:border-gray-800 volume-control">
                <div className="flex flex-col items-center space-y-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={handleMuteToggle}
                  >
                    {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </Button>
                  <Slider
                    orientation="vertical"
                    value={[volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setVolume(value[0] / 100)}
                    className="h-24"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
