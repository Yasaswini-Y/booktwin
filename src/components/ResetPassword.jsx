import React, { useState } from 'react';
import { ChevronRight, Lock } from 'lucide-react';

export default function ResetPassword({ token, onNavigateToLogin }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password.');
      }

      setSuccess('Password reset successfully! You can now log in with your new password.');
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
          Set New Password
        </h1>
        <p className="text-ink/60 font-medium">
          Choose a strong password for your account.
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
            <button
              onClick={onNavigateToLogin}
              className="block mt-3 text-accent font-bold hover:underline"
            >
              Go to Login →
            </button>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-leather px-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3.5 pl-10 rounded-xl border border-leather/20 bg-white/50 focus:bg-white focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-ink/30"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-leather px-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
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
                  Reset Password <ChevronRight className="w-5 h-5" strokeWidth={3} />
                </>
              )}
            </button>
          </form>
        )}

        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </div>
  );
}
