import React, { useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';

export default function DiscoveryFeed({ currentUser, onConnect }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scoredUsers, setScoredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch matches from the backend
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        // Note: the backend handles fetching the current user and excluding them,
        // and calculating the Jaccard similarity scores and shared items.
        const token = localStorage.getItem('booktwin_token');
        const response = await fetch('http://localhost:5000/api/matches', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setScoredUsers(data);
        }
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      fetchMatches();
    }
  }, [currentUser]);

  const handleSkip = () => {
    if (currentIndex < scoredUsers.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(scoredUsers.length); // out of bounds
    }
  };

  const currentMatch = scoredUsers[currentIndex];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] text-center p-8 animate-in fade-in">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-ink/60 font-medium">Finding your reading twins...</p>
      </div>
    );
  }

  if (!currentMatch) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] text-center p-8 animate-in fade-in">
        <div className="w-24 h-24 rounded-full bg-leather/5 flex items-center justify-center mb-6 border border-leather/10">
          <span className="text-4xl opacity-50">📚</span>
        </div>
        <h2 className="text-2xl font-bold text-leather mb-2">End of the chapter</h2>
        <p className="text-ink/60 font-medium">You've seen all potential matches for now. Check back later for new readers!</p>
      </div>
    );
  }

  return (
    <div className="p-4 h-[calc(100vh-64px)] flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-2">
      <div className="w-full max-w-[360px] relative">
        <ProfileCard 
          key={currentMatch.id}
          user={currentMatch} 
          onSkip={handleSkip} 
          onConnect={() => onConnect(currentMatch)} 
        />
      </div>
    </div>
  );
}
