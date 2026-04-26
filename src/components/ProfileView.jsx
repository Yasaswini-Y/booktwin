import React from 'react';
import { ArrowLeft, BookOpen, Star } from 'lucide-react';

export default function ProfileView({ user, onBack }) {
  if (!user) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-y-auto animate-in fade-in pb-10">
      <div className="relative h-64 bg-leather/5 shrink-0">
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
          <h1 className="text-3xl font-extrabold text-white drop-shadow-md">{user.name}</h1>
          <p className="text-white/80 font-medium text-sm mt-1">{user.bio || "A fellow reader seeking new worlds."}</p>
        </div>
        
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition-colors border border-white/20"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-4 text-leather">
            <Star className="w-5 h-5 text-accent" fill="currentColor" />
            <h2 className="text-xl font-bold">Favorite Genres</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.favoriteGenres && user.favoriteGenres.map(genre => (
              <span key={genre} className="bg-parchment border border-leather/10 px-3 py-1.5 rounded-lg text-sm font-semibold text-leather shadow-sm">
                {genre}
              </span>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 text-leather">
            <BookOpen className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold">Favorite Books</h2>
          </div>
          <div className="space-y-3">
            {user.favoriteBooks && user.favoriteBooks.map(book => (
              <div key={book.id} className="flex flex-col p-4 bg-white border border-leather/10 rounded-xl shadow-sm">
                <span className="font-bold text-leather">{book.title}</span>
                <span className="text-sm text-ink/60 font-medium">{book.author}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
