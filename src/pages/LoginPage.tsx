
import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="container-custom flex justify-center py-16">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-medium mb-8 text-center">Log In</h1>
        
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-2 bg-secondary rounded-md focus:outline-none focus:ring-1 focus:ring-primary/20"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full p-2 bg-secondary rounded-md focus:outline-none focus:ring-1 focus:ring-primary/20"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <button 
              type="submit"
              className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/signup" className="text-foreground hover:underline">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
