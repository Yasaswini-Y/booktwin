import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bookmark, BookHeart } from 'lucide-react';

const topics = [
  "...fantasy lovers",
  "...dark academia",
  "...enemies to lovers",
  "...midnight readers"
];

export default function LandingAuth({ onNavigateToAuth, onNavigateToAbout }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % topics.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col md:flex-row bg-[#FCFAFF] text-[#2D1B36] font-sans overflow-hidden relative">
      
      {/* Top Navigation - Fixed at top */}
      <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-[100]">
        <div className="flex items-center gap-2 font-black text-xl tracking-tight">
          <BookHeart className="w-8 h-8 text-[#8B5FBF]" strokeWidth={2.5} />
          <span>BookTwin</span>
        </div>
        <div className="flex items-center gap-6 font-bold text-sm">
          <button onClick={onNavigateToAbout} className="hover:opacity-70 transition-opacity hidden sm:block">Our Story</button>
          <button onClick={() => onNavigateToAuth(true)} className="hover:opacity-70 transition-opacity">Log in</button>
          <button 
            onClick={() => onNavigateToAuth(false)}
            className="bg-[#8B5FBF] text-white px-5 py-2.5 rounded-full hover:bg-[#724a9e] transition-colors shadow-md"
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* Left Column: The Hook */}
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-20 relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-4">
          Find your next great read for
          <br />
          <div className="min-h-[120px] md:min-h-[150px] relative mt-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute text-[#8B5FBF] block"
              >
                {topics[index]}
              </motion.span>
            </AnimatePresence>
          </div>
        </h1>

        {/* Carousel Indicators */}
        <div className="flex gap-2 mb-10 mt-4">
          {topics.map((_, i) => (
            <div 
              key={i} 
              className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${i === index ? 'bg-[#8B5FBF] w-6' : 'bg-[#8B5FBF]/30'}`}
            />
          ))}
        </div>

        <div className="space-y-4 max-w-sm">
          <button 
            onClick={() => onNavigateToAuth(false)}
            className="w-full bg-[#8B5FBF] text-white py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Join BookTwin for free
          </button>
          <p className="text-center font-semibold text-sm opacity-80">
            <button onClick={() => onNavigateToAuth(true)} className="hover:underline">I already have an account</button>
          </p>
        </div>
      </div>

      {/* Right Column: Floating Image Cards */}
      <div className="hidden md:flex w-1/2 h-full relative items-center justify-center pointer-events-none">
        
        {/* Decorative Background Blob */}
        <div className="absolute w-[120%] h-[120%] bg-gradient-to-tr from-[#FCFAFF] via-[#f1e6fc] to-[#FCFAFF] opacity-50 blur-3xl rounded-full" />

        <div className="relative w-full max-w-lg aspect-square mt-16 md:mt-24">
          
          {/* Main central image */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute top-[10%] left-[20%] w-64 h-80 rounded-3xl overflow-hidden shadow-2xl border-[6px] border-white z-20 rotate-[-4deg]"
          >
            <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800" alt="Reading book" className="w-full h-full object-cover" />
            
            {/* Floating Badge */}
            <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-full shadow-xl border border-gray-100 z-30 animate-bounce" style={{ animationDuration: '3s' }}>
              <Heart className="w-6 h-6 text-[#8B5FBF]" fill="currentColor" />
            </div>
          </motion.div>

          {/* Top right floating image */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute -top-[5%] right-[10%] w-48 h-56 rounded-3xl overflow-hidden shadow-xl border-[4px] border-white z-10 rotate-[6deg]"
          >
            <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600" alt="Cozy library" className="w-full h-full object-cover" />
          </motion.div>

          {/* Bottom left floating image */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute bottom-[5%] left-[5%] w-56 h-48 rounded-3xl overflow-hidden shadow-xl border-[5px] border-white z-30 rotate-[2deg]"
          >
            <img src="https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&q=80&w=600" alt="Coffee and book" className="w-full h-full object-cover" />
            
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
              <Bookmark className="w-4 h-4 text-[#2D1B36]" fill="currentColor" />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
