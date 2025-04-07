
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="border-b border-border">
      <div className="container-custom flex justify-between items-center h-16">
        <div className="font-semibold text-lg tracking-tight">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            Audio Serenity
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/catalog" className="navbar-link">Catalog</Link>
          <Link to="/login" className="btn-subtle">Log In</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
