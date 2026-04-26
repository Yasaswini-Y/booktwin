import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Toaster, toast } from 'sonner';
import LandingAuth from './components/LandingAuth';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import DiscoveryFeed from './components/DiscoveryFeed';
import Chatroom from './components/Chatroom';
import ProfileView from './components/ProfileView';
import About from './components/About';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import VerifyEmail from './components/VerifyEmail';
import EditProfile from './components/EditProfile';
import { BookHeart, LogOut } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [matchedUser, setMatchedUser] = useState(null);
  const [viewData, setViewData] = useState(null); // for passing tokens etc.
  const socketRef = useRef(null);

  useEffect(() => {
    // Parse hash-based deep links for mock email URLs
    const hash = window.location.hash;
    if (hash.startsWith('#/verify-email/')) {
      const token = hash.replace('#/verify-email/', '');
      setViewData(token);
      setCurrentView('verifyEmail');
      window.location.hash = '';
      return;
    }
    if (hash.startsWith('#/reset-password/')) {
      const token = hash.replace('#/reset-password/', '');
      setViewData(token);
      setCurrentView('resetPassword');
      window.location.hash = '';
      return;
    }

    // Check for token on mount
    const token = localStorage.getItem('booktwin_token');
    if (token) {
      fetch('http://localhost:5000/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error('Token invalid');
        return res.json();
      })
      .then(userData => {
        setCurrentUser(userData);
        if (!userData.favoriteBooks || userData.favoriteBooks.length === 0) {
          setCurrentView('onboarding');
        } else {
          setCurrentView('feed');
        }
      })
      .catch(err => {
        console.error(err);
        localStorage.removeItem('booktwin_token');
        setCurrentView('landing');
      });
    }
  }, []);

  // Socket.io: connect when user is authenticated, disconnect on logout
  useEffect(() => {
    if (currentUser && currentUser._id) {
      const socket = io('http://localhost:5000');
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
        socket.emit('add_user', currentUser._id);
      });

      socket.on('new_message_notification', (data) => {
        toast.message(`New message from ${data.senderName}`, {
          description: data.messagePreview,
          duration: 5000,
        });
      });

      return () => {
        socket.disconnect();
        socketRef.current = null;
      };
    }
  }, [currentUser]);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    if (!userData.favoriteBooks || userData.favoriteBooks.length === 0) {
      setCurrentView('onboarding');
    } else {
      setCurrentView('feed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('booktwin_token');
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleOnboardComplete = (profile) => {
    setCurrentUser(profile);
    setCurrentView('feed');
  };

  const handleConnect = (user) => {
    setMatchedUser(user);
    setCurrentView('chat');
  };

  const handleBackToFeed = () => {
    setMatchedUser(null);
    setCurrentView('feed');
  };

  const handleProfileSave = (updatedUser) => {
    setCurrentUser(updatedUser);
    setCurrentView('profile');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Toaster position="top-right" richColors expand closeButton />
      {currentView !== 'landing' && (
        <header className="bg-white/80 backdrop-blur-md border-b border-leather/10 sticky top-0 z-50 shadow-sm">
          <div className="max-w-md mx-auto px-5 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div 
                className="flex items-center gap-2 text-leather font-black text-xl tracking-tight cursor-pointer"
                onClick={() => {
                  if (currentUser && currentView !== 'auth' && currentView !== 'onboarding') {
                    setCurrentView('feed');
                  } else {
                    setCurrentView('landing');
                  }
                }}
              >
                <BookHeart className="w-7 h-7 text-accent" strokeWidth={2.5} />
                <span>BookTwin</span>
              </div>
            </div>
            {currentUser && currentView !== 'auth' && currentView !== 'onboarding' && (
              <div className="flex items-center gap-4">
                <button onClick={handleLogout} className="text-ink/50 hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
                <div 
                  onClick={() => setCurrentView('profile')}
                  className="w-9 h-9 rounded-full bg-leather/20 flex items-center justify-center text-xs font-bold text-leather border-2 border-white shadow-md overflow-hidden ring-2 ring-accent/20 cursor-pointer hover:scale-105 transition-transform"
                >
                   <img src={currentUser.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${currentUser.email}`} alt="Me" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>
        </header>
      )}
      
      <main className={`flex-1 ${currentView !== 'landing' ? 'max-w-md mx-auto w-full relative' : 'w-full'}`}>
        {currentView === 'landing' && <LandingAuth onNavigateToAuth={(isLogin) => setCurrentView('auth')} onNavigateToAbout={() => setCurrentView('about')} />}
        {currentView === 'auth' && <Auth onLoginSuccess={handleLoginSuccess} onForgotPassword={() => setCurrentView('forgotPassword')} />}
        {currentView === 'onboarding' && <Onboarding onComplete={handleOnboardComplete} />}
        {currentView === 'feed' && <DiscoveryFeed currentUser={currentUser} onConnect={handleConnect} />}
        {currentView === 'chat' && <Chatroom matchedUser={matchedUser} currentUser={currentUser} onBack={handleBackToFeed} />}
        {currentView === 'profile' && <ProfileView user={currentUser} onBack={handleBackToFeed} onEdit={() => setCurrentView('editProfile')} />}
        {currentView === 'about' && <About onBack={() => setCurrentView('landing')} />}
        {currentView === 'forgotPassword' && <ForgotPassword onBack={() => setCurrentView('auth')} />}
        {currentView === 'resetPassword' && <ResetPassword token={viewData} onNavigateToLogin={() => setCurrentView('auth')} />}
        {currentView === 'verifyEmail' && <VerifyEmail token={viewData} onNavigateToLogin={() => setCurrentView('auth')} />}
        {currentView === 'editProfile' && <EditProfile currentUser={currentUser} onSave={handleProfileSave} onBack={() => setCurrentView('profile')} />}
      </main>
    </div>
  );
}

export default App;
