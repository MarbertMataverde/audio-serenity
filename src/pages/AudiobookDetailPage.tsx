
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Audiobook } from '@/types/audiobook';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, Clock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AudiobookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [audiobook, setAudiobook] = useState<Audiobook | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentAudiobook, isPlaying, playAudiobook, togglePlayPause } = useAudioPlayer();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchAudiobook = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('audiobooks')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setAudiobook(data as Audiobook);
      } catch (error: any) {
        console.error('Error fetching audiobook:', error);
        toast({
          title: "Error",
          description: "Could not load the audiobook.",
          variant: "destructive"
        });
        navigate('/catalog');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAudiobook();
  }, [id, navigate, toast]);
  
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };
  
  const handlePlayClick = () => {
    if (!audiobook) return;
    
    if (currentAudiobook?.id === audiobook.id) {
      togglePlayPause();
    } else {
      playAudiobook(audiobook);
    }
  };
  
  if (loading) {
    return (
      <div className="container-custom py-12 text-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!audiobook) {
    return (
      <div className="container-custom py-12 text-center">
        <h1 className="text-2xl font-medium mb-4">Audiobook Not Found</h1>
        <Button onClick={() => navigate('/catalog')}>Back to Catalog</Button>
      </div>
    );
  }
  
  const isCurrentlyPlaying = currentAudiobook?.id === audiobook.id && isPlaying;
  
  return (
    <div className="container-custom py-12">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/catalog')}
          className="mb-6"
        >
          Back to Catalog
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cover image */}
        <div className="md:col-span-1">
          <div className="aspect-[2/3] rounded-lg overflow-hidden bg-secondary">
            <img 
              src={audiobook.cover_url} 
              alt={audiobook.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="mt-6">
            <Button 
              onClick={handlePlayClick}
              className="w-full flex items-center justify-center text-base"
              size="lg"
            >
              {isCurrentlyPlaying ? (
                <>
                  <Pause className="mr-2" size={18} />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 ml-1" size={18} />
                  Play
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Book details */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{audiobook.title}</h1>
          <div className="text-lg text-muted-foreground mb-6">{audiobook.author}</div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              {formatDuration(audiobook.duration)}
            </div>
            <div className="flex items-center">
              <User size={16} className="mr-1" />
              {audiobook.author}
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-3">About this audiobook</h2>
            <div className="prose dark:prose-invert">
              <p>{audiobook.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudiobookDetailPage;
