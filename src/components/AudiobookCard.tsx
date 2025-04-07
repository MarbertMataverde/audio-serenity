
import React from 'react';
import { Play } from 'lucide-react';

interface AudiobookCardProps {
  title: string;
  author: string;
  coverUrl: string;
}

const AudiobookCard = ({ title, author, coverUrl }: AudiobookCardProps) => {
  return (
    <div className="audiobook-card group">
      <div className="relative aspect-[2/3] mb-3 bg-secondary overflow-hidden rounded">
        <img 
          src={coverUrl} 
          alt={`${title} cover`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center transition-transform group-hover:scale-110">
            <Play size={20} className="text-primary ml-1" />
          </button>
        </div>
      </div>
      <h3 className="font-medium text-sm text-foreground line-clamp-1">{title}</h3>
      <p className="text-xs text-muted-foreground">{author}</p>
    </div>
  );
};

export default AudiobookCard;
