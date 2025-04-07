
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Audiobook } from '@/types/audiobook';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

type AudioPlayerContextType = {
  currentAudiobook: Audiobook | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  playAudiobook: (audiobook: Audiobook, startPosition?: number) => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  saveProgress: () => Promise<void>;
};

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentAudiobook, setCurrentAudiobook] = useState<Audiobook | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<number | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Set up audio element event listeners
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.addEventListener('error', handleError);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current = null;
      }
      
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  // Save progress every 30 seconds
  useEffect(() => {
    if (currentAudiobook && user) {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      
      progressInterval.current = window.setInterval(() => {
        if (isPlaying) {
          saveProgress();
        }
      }, 30000) as unknown as number;
      
      return () => {
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
          progressInterval.current = null;
        }
      };
    }
  }, [currentAudiobook, isPlaying, user]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    saveProgress(true);
  };

  const handleError = (e: any) => {
    console.error('Audio playback error:', e);
    toast({
      title: "Playback Error",
      description: "There was an error playing this audiobook.",
      variant: "destructive"
    });
    setIsPlaying(false);
  };

  const playAudiobook = async (audiobook: Audiobook, startPosition = 0) => {
    try {
      if (audioRef.current) {
        // Stop current audio if playing
        audioRef.current.pause();
        
        // Set new audio source
        audioRef.current.src = audiobook.audio_url;
        audioRef.current.currentTime = startPosition;
        audioRef.current.volume = volume;
        
        // Preload audio
        audioRef.current.load();
        
        // Play when ready
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setCurrentAudiobook(audiobook);
            })
            .catch(error => {
              console.error('Playback prevented:', error);
              // Handle autoplay restrictions
              setIsPlaying(false);
              setCurrentAudiobook(audiobook);
            });
        }
        
        // Attempt to load saved position if no position was specified
        if (startPosition === 0 && user) {
          loadProgress(audiobook.id);
        }
      }
    } catch (error) {
      console.error('Error playing audiobook:', error);
      toast({
        title: "Playback Error",
        description: "There was an error playing this audiobook.",
        variant: "destructive"
      });
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentAudiobook) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      saveProgress();
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(error => {
            console.error('Playback prevented:', error);
            setIsPlaying(false);
          });
      }
    }
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const setVolume = (newVolume: number) => {
    if (!audioRef.current) return;
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    audioRef.current.volume = clampedVolume;
    setVolumeState(clampedVolume);
  };

  // Save listening progress to database
  const saveProgress = async (completed = false) => {
    if (!user || !currentAudiobook || !audioRef.current) return;
    
    try {
      const current_position = audioRef.current.currentTime;
      const isCompleted = completed || (current_position / duration > 0.95);
      
      const { data, error } = await supabase
        .from('listening_progress')
        .upsert({
          user_id: user.id,
          audiobook_id: currentAudiobook.id,
          current_position: current_position,
          completed: isCompleted,
          last_listened_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,audiobook_id'
        });
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  // Load listening progress from database
  const loadProgress = async (audiobookId: string) => {
    if (!user || !audioRef.current) return;
    
    try {
      const { data, error } = await supabase
        .from('listening_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('audiobook_id', audiobookId)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data && !data.completed) {
        audioRef.current.currentTime = data.current_position;
        setCurrentTime(data.current_position);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  return (
    <AudioPlayerContext.Provider value={{
      currentAudiobook,
      isPlaying,
      duration,
      currentTime,
      volume,
      playAudiobook,
      togglePlayPause,
      seek,
      setVolume,
      saveProgress,
    }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
