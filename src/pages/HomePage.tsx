
import React from 'react';
import SearchBar from '../components/SearchBar';
import FeaturedAudiobooks from '../components/FeaturedAudiobooks';
import NewReleases from '../components/NewReleases';

const HomePage = () => {
  return (
    <div className="container-custom py-12">
      <section className="text-center mb-12">
        <h1 className="text-3xl font-light mb-6 tracking-tight text-[#141314]">
          Immerse Yourself in Stories
        </h1>
        <p className="text-[#141314]/70 max-w-md mx-auto mb-8">
          Your gateway to audiobooks. Discover stories that transport you to new worlds.
        </p>
        <SearchBar />
      </section>
      
      <FeaturedAudiobooks />
      <NewReleases />
    </div>
  );
};

export default HomePage;
