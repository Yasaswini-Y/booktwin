import React from 'react';
import { ArrowLeft, Globe, Mail, Send } from 'lucide-react';

export default function About({ onBack }) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] justify-center p-6 animate-in fade-in duration-500">
      <div className="text-center w-full max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm p-10 md:p-12 rounded-3xl border border-leather/10 shadow-xl relative overflow-hidden mt-8 mb-4">
          <h1 className="text-4xl font-extrabold text-leather mb-6 tracking-tight relative z-10">
            Welcome to BookTwin
          </h1>
          
          <hr className="my-6 border-gray-200 relative z-10" />
          
          <p className="text-ink/80 font-medium text-lg leading-relaxed relative z-10 mb-10">
            BookTwin is an algorithmic social matching platform designed to connect readers based on their favorite books, genres, and literary tastes. Find your book twin and start chatting today!
          </p>

          <hr className="my-8 border-gray-200 relative z-10" />

          <div className="relative z-10">
            <h3 className="text-ink/60 font-semibold text-sm uppercase tracking-widest mb-5">Join our community</h3>
            <div className="flex items-center justify-center gap-5">
              <a href="#" className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent hover:bg-accent hover:text-white hover:-translate-y-1 transition-all shadow-sm">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent hover:bg-accent hover:text-white hover:-translate-y-1 transition-all shadow-sm">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent hover:bg-accent hover:text-white hover:-translate-y-1 transition-all shadow-sm">
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        <button 
          onClick={onBack}
          className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-ink/60 hover:text-leather transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>
    </div>
  );
}
