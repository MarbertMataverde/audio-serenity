
import React from 'react';
import AudiobookCard from './AudiobookCard';

const NewReleases = () => {
  const audiobooks = [
    {
      id: 1,
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      coverUrl: 'https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?q=80&w=987&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'The Paper Palace',
      author: 'Miranda Cowley Heller',
      coverUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=1014&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'Klara and the Sun',
      author: 'Kazuo Ishiguro',
      coverUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=1776&auto=format&fit=crop'
    },
    {
      id: 4,
      title: 'The Last Thing He Told Me',
      author: 'Laura Dave',
      coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1098&auto=format&fit=crop'
    }
  ];

  return (
    <section className="py-8">
      <h2 className="text-lg font-medium mb-5">New Releases</h2>
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

export default NewReleases;
