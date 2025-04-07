
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Audiobook } from '@/types/audiobook';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const [featuredAudiobooks, setFeaturedAudiobooks] = useState<Audiobook[]>([]);
  const [newReleases, setNewReleases] = useState<Audiobook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentAudiobook, isPlaying, playAudiobook, togglePlayPause } = useAudioPlayer();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchAudiobooks = async () => {
      try {
        // Get latest audiobooks for new releases
        const { data: newData, error: newError } = await supabase
          .from('audiobooks')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);
          
        if (newError) throw newError;
        setNewReleases(newData as Audiobook[]);
        
        // For featured, we're just getting a different set
        // In a real app, we might have a "featured" flag or other criteria
        const { data: featuredData, error: featuredError } = await supabase
          .from('audiobooks')
          .select('*')
          .order('title', { ascending: true })
          .limit(4);
          
        if (featuredError) throw featuredError;
        setFeaturedAudiobooks(featuredData as Audiobook[]);
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
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/catalog?q=${encodeURIComponent(searchQuery)}`);
  };
  
  const renderAudiobookGrid = (books: Audiobook[]) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {books.map((book) => (
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
          </div>
        </Link>
      ))}
    </div>
  );
  
  return (
    <div className="container-custom py-12">
      <section className="text-center mb-12">
        <h1 className="text-3xl font-light mb-6 tracking-tight text-[#141314]">
          Immerse Yourself in Stories
        </h1>
        <p className="text-[#141314]/70 max-w-md mx-auto mb-8">
          Your gateway to audiobooks. Discover stories that transport you to new worlds.
        </p>
        
        <form onSubmit={handleSearch} className="relative w-full max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search for audiobooks..."
            className="search-input pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>
      </section>
      
      {loading ? (
        <div className="text-center py-12">
          <p>Loading audiobooks...</p>
        </div>
      ) : (
        <>
          <section className="py-8">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-medium">Featured Audiobooks</h2>
              <Button variant="link" asChild>
                <Link to="/catalog">View All</Link>
              </Button>
            </div>
            {featuredAudiobooks.length > 0 ? (
              renderAudiobookGrid(featuredAudiobooks)
            ) : (
              <p className="text-center py-4">No featured audiobooks available.</p>
            )}
          </section>
          
          <section className="py-8">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-medium">New Releases</h2>
              <Button variant="link" asChild>
                <Link to="/catalog">View All</Link>
              </Button>
            </div>
            {newReleases.length > 0 ? (
              renderAudiobookGrid(newReleases)
            ) : (
              <p className="text-center py-4">No new releases available.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default HomePage;
