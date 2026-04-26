import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { getSharedItems } from '../utils/jaccard';

export default function Chatroom({ matchedUser, currentUser, onBack }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (!matchedUser || !currentUser) return;

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('booktwin_token');
        const response = await fetch(`http://localhost:5000/api/messages/${matchedUser._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
          
          // If no messages, maybe we could insert an icebreaker, but for now we'll just leave it empty.
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
    
    // In a real app we'd use WebSockets for real-time updates.
    // For this prototype, we could poll, but we'll stick to basic fetch.
    const intervalId = setInterval(fetchMessages, 3000);
    return () => clearInterval(intervalId);
  }, [matchedUser, currentUser]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const content = inputText;
    setInputText('');
    
    try {
      const token = localStorage.getItem('booktwin_token');
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: matchedUser._id,
          content
        })
      });
      
      if (response.ok) {
        const newMsg = await response.json();
        setMessages(prev => [...prev, newMsg]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!matchedUser) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-white absolute inset-0 z-40 animate-in slide-in-from-right-8 duration-300">
      {/* Chat header */}
      <div className="px-4 py-3 border-b border-leather/10 flex items-center gap-3 bg-white/95 backdrop-blur-md z-10 sticky top-0 shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 text-ink/60 hover:text-leather hover:bg-leather/10 rounded-full transition-all active:scale-95">
          <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
        </button>
        <div className="w-10 h-10 rounded-full border border-leather/20 overflow-hidden bg-leather/5">
          <img src={matchedUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-bold text-leather leading-tight">{matchedUser.name}</h3>
          <p className="text-[10px] text-ink/50 font-bold tracking-wide uppercase">Match {matchedUser.score}%</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-parchment/40">
        <div className="flex justify-center mb-6 mt-2">
          <span className="text-[10px] bg-accent/10 border border-accent/20 text-accent px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> BookTwin Private Chat
          </span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser._id;
          return (
            <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[15px] shadow-sm leading-relaxed ${
                isMe 
                  ? 'bg-accent text-white rounded-br-sm' 
                  : 'bg-white border border-leather/10 text-ink rounded-bl-sm font-medium'
              }`}>
                {msg.content}
              </div>
            </div>
          )
        })}
      </div>

      {/* Input area */}
      <div className="p-4 bg-white border-t border-leather/10 pb-6">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-parchment/80 border border-leather/10 rounded-full py-3.5 px-5 text-[15px] outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-ink/40 shadow-inner"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="w-12 h-12 rounded-full bg-leather text-white flex items-center justify-center disabled:opacity-40 transition-all hover:bg-leather/90 active:scale-95 shadow-md flex-shrink-0"
          >
            <Send className="w-5 h-5 -ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
