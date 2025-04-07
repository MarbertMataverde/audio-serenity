
import React from 'react';
import SearchBar from '../components/SearchBar';
import AudiobookCard from '../components/AudiobookCard';

const CatalogPage = () => {
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
    },
    {
      id: 5,
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      coverUrl: 'https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?q=80&w=987&auto=format&fit=crop'
    },
    {
      id: 6,
      title: 'The Paper Palace',
      author: 'Miranda Cowley Heller',
      coverUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=1014&auto=format&fit=crop'
    },
    {
      id: 7,
      title: 'Klara and the Sun',
      author: 'Kazuo Ishiguro',
      coverUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=1776&auto=format&fit=crop'
    },
    {
      id: 8,
      title: 'The Last Thing He Told Me',
      author: 'Laura Dave',
      coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1098&auto=format&fit=crop'
    }
  ];

  return (
    <div className="container-custom py-12">
      <h1 className="text-2xl font-medium mb-6">Browse Audiobooks</h1>
      <div className="mb-8">
        <SearchBar />
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {audiobooks.map((book) => (
          <AudiobookCard 
            key={book.id}
            title={book.title}
            author={book.author}
            coverUrl={book.coverUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default CatalogPage;
