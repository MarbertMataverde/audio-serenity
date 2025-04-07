
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const { user, signOut, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  return (
    <nav className="border-b border-[#141314]/10">
      <div className="container-custom flex justify-between items-center h-16">
        <div className="font-semibold text-lg tracking-tight">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            Audio Serenity
          </Link>
        </div>
        
        {/* Desktop Menu */}
        {!isMobile && (
          <div className="flex items-center space-x-4">
            <Link to="/" className="navbar-link">Home</Link>
            <Link to="/catalog" className="navbar-link">Catalog</Link>
            {isAdmin && <Link to="/admin" className="navbar-link">Admin</Link>}
            {user ? (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost"
                  size="sm"
                  className="font-normal"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <User size={16} />
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-subtle">Log In</Link>
            )}
          </div>
        )}
        
        {/* Mobile Menu Toggle */}
        {isMobile && (
          <button 
            onClick={toggleMobileMenu}
            className="text-[#141314] p-2"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>
      
      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background pt-16">
          <div className="container-custom flex flex-col space-y-4 py-6">
            <Link to="/" className="navbar-link py-3 text-base" onClick={closeMobileMenu}>Home</Link>
            <Link to="/catalog" className="navbar-link py-3 text-base" onClick={closeMobileMenu}>Catalog</Link>
            {isAdmin && <Link to="/admin" className="navbar-link py-3 text-base" onClick={closeMobileMenu}>Admin</Link>}
            {user ? (
              <>
                <div className="flex items-center space-x-3 py-3">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <span className="text-sm">{user.email}</span>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => {
                    signOut();
                    closeMobileMenu();
                  }}
                  className="mt-4"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="btn-subtle w-full flex justify-center" 
                onClick={closeMobileMenu}
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
