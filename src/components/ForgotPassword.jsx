import React, { useState } from 'react';
import { ArrowLeft, Mail, ChevronRight } from 'lucide-react';

export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong.');
      }

      setSuccess('Password reset link has been sent! Check the backend terminal console for the mock email link.');
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
          Reset Password
        </h1>
        <p className="text-ink/60 font-medium">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-6 pb-10 rounded-3xl border border-leather/10 shadow-xl relative h-auto min-h-fit">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
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
            <label className="text-sm font-bold text-leather px-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@austen.com"
                className="w-full p-3.5 pl-10 rounded-xl border border-leather/20 bg-white/50 focus:bg-white focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-ink/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-leather text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                Send Reset Link <ChevronRight className="w-5 h-5" strokeWidth={3} />
              </>
            )}
          </button>
        </form>

        <button
          onClick={onBack}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 text-sm font-bold text-ink/60 hover:text-leather transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </button>

        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </div>
  );
}
