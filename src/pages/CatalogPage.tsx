
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Audiobook } from '@/types/audiobook';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { Play, Pause } from 'lucide-react';

const CatalogPage = () => {
  const [audiobooks, setAudiobooks] = useState<Audiobook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentAudiobook, isPlaying, playAudiobook, togglePlayPause } = useAudioPlayer();
  
  useEffect(() => {
    const fetchAudiobooks = async () => {
      try {
        const { data, error } = await supabase
          .from('audiobooks')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setAudiobooks(data as Audiobook[]);
      } catch (error) {
        console.error('Error fetching audiobooks:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAudiobooks();
  }, []);
  
  const handlePlayClick = (e: React.MouseEvent, audiobook: Audiobook) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (currentAudiobook?.id === audiobook.id) {
      togglePlayPause();
    } else {
      playAudiobook(audiobook);
    }
  };
  
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };
  
  const filteredAudiobooks = audiobooks.filter(book => {
    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
  });
  
  return (
    <div className="container-custom py-12">
      <h1 className="text-2xl font-medium mb-6">Browse Audiobooks</h1>
      
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by title or author..."
          className="search-input w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <p>Loading audiobooks...</p>
        </div>
      ) : filteredAudiobooks.length === 0 ? (
        <div className="text-center py-12">
          <p>No audiobooks found. {searchQuery && 'Try a different search term.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {filteredAudiobooks.map((book) => (
            <Link 
              key={book.id} 
              to={`/audiobook/${book.id}`}
              className="group"
            >
              <div className="audiobook-card">
                <div className="relative aspect-[2/3] mb-3 bg-secondary overflow-hidden rounded">
                  <img 
                    src={book.cover_url} 
                    alt={`${book.title} cover`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      className="w-12 h-12 rounded-full bg-white flex items-center justify-center transition-transform group-hover:scale-110"
                      onClick={(e) => handlePlayClick(e, book)}
                    >
                      {currentAudiobook?.id === book.id && isPlaying ? (
                        <Pause size={20} className="text-primary" />
                      ) : (
                        <Play size={20} className="text-primary ml-1" />
                      )}
                    </button>
                  </div>
                </div>
                <h3 className="font-medium text-sm text-foreground line-clamp-1">{book.title}</h3>
                <p className="text-xs text-muted-foreground">{book.author}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatDuration(book.duration)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
