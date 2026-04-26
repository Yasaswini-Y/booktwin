import React, { useState } from 'react';
import { PRESET_BOOKS, PRESET_GENRES } from '../data/constants';
import { Check, ChevronRight } from 'lucide-react';

export default function Onboarding({ onComplete }) {
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [name, setName] = useState('');
  const [customBookTitle, setCustomBookTitle] = useState('');
  const [customBookAuthor, setCustomBookAuthor] = useState('');

  const handleAddCustomBook = () => {
    if (!customBookTitle.trim()) return;
    
    const newBook = {
      id: `custom-${Date.now()}`,
      title: customBookTitle,
      author: customBookAuthor || 'Unknown Author',
      genres: []
    };
    
    // Add to selected array right away
    setSelectedBooks([newBook, ...selectedBooks]);
    setCustomBookTitle('');
    setCustomBookAuthor('');
  };

  const toggleBook = (book) => {
    if (selectedBooks.find(b => b.id === book.id)) {
      setSelectedBooks(selectedBooks.filter(b => b.id !== book.id));
    } else {
      setSelectedBooks([...selectedBooks, book]);
    }
  };

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || selectedBooks.length === 0 || selectedGenres.length === 0) return;
    
    setSaving(true);
    const token = localStorage.getItem('booktwin_token');
    
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${name}`,
          favoriteBooks: selectedBooks,
          favoriteGenres: selectedGenres,
          bio: "A fellow reader seeking new worlds."
        })
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        onComplete(updatedProfile);
      } else {
        console.error("Failed to save profile");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 pb-28 animate-in fade-in duration-500">
      <div className="text-center mb-10 pt-4">
        <h1 className="text-4xl font-extrabold text-leather mb-3 tracking-tight">Create Profile</h1>
        <p className="text-ink/60 font-medium">Tell us what you read, we'll tell you who you are.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-4">
          <label className="font-bold text-leather text-lg">Your Name</label>
          <input 
            type="text" 
            placeholder="e.g. Jane Austen"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 rounded-xl border border-leather/20 bg-white/80 focus:bg-white focus:ring-2 focus:ring-accent outline-none transition-all shadow-sm text-lg placeholder:text-ink/30"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="font-bold text-leather text-lg">Favorite Genres</label>
            <span className="text-xs font-bold px-2 py-1 bg-leather/10 text-leather rounded-md">{selectedGenres.length} selected</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {PRESET_GENRES.map(genre => {
              const isSelected = selectedGenres.includes(genre);
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isSelected 
                      ? 'bg-accent text-white shadow-md scale-105 ring-2 ring-accent ring-offset-2 ring-offset-parchment'
                      : 'bg-white border border-leather/10 text-ink/80 hover:border-accent/40 hover:bg-white/90'
                  }`}
                >
                  {genre}
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="font-bold text-leather text-lg">Favorite Books</label>
            <span className="text-xs font-bold px-2 py-1 bg-leather/10 text-leather rounded-md">{selectedBooks.length} selected</span>
          </div>

          <div className="bg-white/60 p-4 rounded-xl border border-leather/20 shadow-sm space-y-3">
            <p className="text-xs font-bold text-ink/50 uppercase tracking-wider">Add Custom Book</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Book Title"
                value={customBookTitle}
                onChange={(e) => setCustomBookTitle(e.target.value)}
                className="flex-1 w-1/2 p-2.5 rounded-lg border border-leather/20 bg-white focus:ring-2 focus:ring-accent outline-none text-sm placeholder:text-ink/30"
              />
              <input 
                type="text" 
                placeholder="Author (optional)"
                value={customBookAuthor}
                onChange={(e) => setCustomBookAuthor(e.target.value)}
                className="flex-1 w-1/3 p-2.5 rounded-lg border border-leather/20 bg-white focus:ring-2 focus:ring-accent outline-none text-sm placeholder:text-ink/30"
              />
              <button 
                type="button"
                onClick={handleAddCustomBook}
                disabled={!customBookTitle.trim()}
                className="bg-leather text-white px-4 rounded-lg font-bold text-sm disabled:opacity-50 hover:bg-leather/90 transition-all active:scale-95 shadow-sm"
              >
                Add
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 mt-2">
            {/* Render custom selected books first so they don't disappear into the UI un-toggled */}
            {selectedBooks.filter(b => b.id.startsWith('custom-')).map(book => (
              <button
                key={book.id}
                type="button"
                onClick={() => toggleBook(book)}
                className="flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-300 border-accent bg-accent/5 shadow-sm ring-1 ring-accent"
              >
                <div>
                  <div className="font-bold text-[15px] text-accent">{book.title} (Custom)</div>
                  <div className="text-xs mt-1 font-medium text-ink/50">{book.author}</div>
                </div>
                <div className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center shrink-0 shadow-sm"><Check className="w-4 h-4" strokeWidth={3} /></div>
              </button>
            ))}

            <p className="text-xs font-bold text-ink/40 uppercase tracking-wider pt-2 pb-1">Or select from presets</p>
            
            {PRESET_BOOKS.map(book => {
              const isSelected = selectedBooks.some(b => b.id === book.id);
              return (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => toggleBook(book)}
                  className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-300 ${
                    isSelected 
                    ? 'border-accent bg-accent/5 shadow-sm ring-1 ring-accent'
                    : 'border-leather/10 bg-white hover:border-accent/40 shadow-sm hover:shadow'
                  }`}
                >
                  <div>
                    <div className={`font-bold text-[15px] ${isSelected ? 'text-accent' : 'text-ink'}`}>{book.title}</div>
                    <div className="text-xs mt-1 font-medium text-ink/50">{book.author}</div>
                  </div>
                  {isSelected && <div className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center shrink-0 shadow-sm"><Check className="w-4 h-4" strokeWidth={3} /></div>}
                </button>
              )
            })}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-parchment via-parchment to-transparent z-10 flex justify-center pointer-events-none">
          <div className="max-w-md w-full pointer-events-auto pb-4">
            <button 
              type="submit"
              disabled={!name || selectedBooks.length === 0 || selectedGenres.length === 0}
              className="w-full bg-leather text-white py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-40 disabled:hover:translate-y-0 disabled:shadow-none active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Find My Twins <ChevronRight className="w-6 h-6" strokeWidth={3} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
