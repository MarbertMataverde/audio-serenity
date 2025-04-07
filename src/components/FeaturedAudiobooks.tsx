
import React from 'react';
import AudiobookCard from './AudiobookCard';

const FeaturedAudiobooks = () => {
  const audiobooks = [
    {
      id: 1,
      title: 'The Silent Patient',
      author: 'Alex Michaelides',
      coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=987&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'Atomic Habits',
      author: 'James Clear',
      coverUrl: 'https://images.unsplash.com/photo-1515634928627-2a4e0dae3ddf?q=80&w=1160&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'Where the Crawdads Sing',
      author: 'Delia Owens',
      coverUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1076&auto=format&fit=crop'
    },
    {
      id: 4,
      title: 'The Midnight Library',
      author: 'Matt Haig',
      coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=987&auto=format&fit=crop'
    }
  ];

  return (
    <section className="py-8">
      <h2 className="text-lg font-medium mb-5">Featured Audiobooks</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {audiobooks.map((book) => (
          <AudiobookCard 
            key={book.id}
            title={book.title}
            author={book.author}
            coverUrl={book.coverUrl}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedAudiobooks;
