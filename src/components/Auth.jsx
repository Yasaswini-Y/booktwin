import React, { useState } from 'react';
import { ChevronRight, LogIn, UserPlus } from 'lucide-react';

export default function Auth({ onLoginSuccess, onForgotPassword }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (!isLogin) {
        // Registration success — show verification message instead of auto-logging in
        setSuccess(data.message || 'Registration successful! Check the backend console for your verification link.');
        return;
      }

      // Save token and pass user data up
      localStorage.setItem('booktwin_token', data.token);
      onLoginSuccess(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] justify-center p-6 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-leather mb-3 tracking-tight">
          {isLogin ? 'Welcome Back' : 'Join BookTwin'}
        </h1>
        <p className="text-ink/60 font-medium">
          {isLogin ? 'Log in to continue your reading journey.' : 'Discover readers who share your soul.'}
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-6 pb-10 rounded-3xl border border-leather/10 shadow-xl relative h-auto min-h-fit">
        {/* Toggle tabs */}
        <div className="flex bg-leather/5 rounded-full p-1 mb-6 relative z-10">
          <button 
            type="button"
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all flex items-center justify-center gap-2 ${isLogin ? 'bg-white text-accent shadow-md' : 'text-ink/50 hover:text-ink'}`}
          >
            <LogIn className="w-4 h-4" /> Log In
          </button>
          <button 
            type="button"
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all flex items-center justify-center gap-2 ${!isLogin ? 'bg-white text-accent shadow-md' : 'text-ink/50 hover:text-ink'}`}
          >
            <UserPlus className="w-4 h-4" /> Register
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl text-sm font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-leather px-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@austen.com"
              className="w-full p-3.5 rounded-xl border border-leather/20 bg-white/50 focus:bg-white focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-ink/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-leather px-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3.5 rounded-xl border border-leather/20 bg-white/50 focus:bg-white focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-ink/30"
            />
            {isLogin && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs font-bold text-accent hover:underline px-1 mt-1"
              >
                Forgot Password?
              </button>
            )}
          </div>

          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-leather px-1">Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3.5 rounded-xl border border-leather/20 bg-white/50 focus:bg-white focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-ink/30"
              />
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-leather text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                {isLogin ? 'Enter' : 'Create Account'} <ChevronRight className="w-5 h-5" strokeWidth={3} />
              </>
            )}
          </button>
        </form>

        {/* Decorative background circle */}
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </div>
  );
}

