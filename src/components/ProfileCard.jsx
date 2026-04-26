import React from 'react';
import { X, MessageCircleHeart, Book, Sparkles } from 'lucide-react';

export default function ProfileCard({ user, onSkip, onConnect }) {
  const renderShared = () => {
    if (user.shared.books.length > 0) {
      return (
        <div className="bg-accent/90 text-white font-semibold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 w-fit shadow-md backdrop-blur-sm border border-white/20">
          <Book className="w-3.5 h-3.5" />
          Shared: {user.shared.books[0].title}
          {user.shared.books.length > 1 && ` +${user.shared.books.length - 1}`}
        </div>
      );
    } else if (user.shared.genres.length > 0) {
      return (
        <div className="bg-secondary text-amber-900 font-semibold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 w-fit shadow-md border border-white/40">
          <Sparkles className="w-3.5 h-3.5" />
          Both love {user.shared.genres[0]}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-leather/10 relative">
      {/* Compatibility Score Badge */}
      <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 font-bold text-sm shadow-lg border border-white text-leather flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
        {user.score}% Match
      </div>

      <div className="w-full h-80 bg-leather/5 relative overflow-hidden">
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
          <h2 className="text-3xl font-extrabold text-white mb-2 drop-shadow-md">{user.name}</h2>
          {renderShared()}
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-ink/80 italic mb-6 font-medium">"{user.bio}"</p>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-[10px] font-bold text-ink/40 uppercase tracking-widest mb-2.5">Favorite Genres</h4>
            <div className="flex flex-wrap gap-2">
              {user.favoriteGenres.map(g => (
                <span key={g} className="text-xs font-medium bg-parchment border border-leather/10 px-2.5 py-1 rounded-md text-ink/70">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-8">
          <button 
            onClick={onSkip}
            className="w-14 h-14 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:border-gray-300 hover:text-gray-600 hover:bg-gray-50 transition-all shadow-sm active:scale-95 group"
          >
            <X className="w-6 h-6 group-hover:scale-110 transition-transform" strokeWidth={3} />
          </button>
          
          <button 
            onClick={onConnect}
            className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center shadow-xl shadow-accent/40 hover:scale-110 transition-all active:scale-95 group"
          >
            <MessageCircleHeart className="w-8 h-8 group-hover:animate-pulse" />
          </button>
        </div>
      </div>
    </div>
  );
}
