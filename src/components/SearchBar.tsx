
import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = () => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search query:', query);
    // Search functionality would be implemented here
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl mx-auto">
      <input
        type="text"
        placeholder="Search for audiobooks..."
        className="search-input pr-10"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button 
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Search size={18} />
      </button>
    </form>
  );
};

export default SearchBar;
