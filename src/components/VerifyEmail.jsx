import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function VerifyEmail({ token, onNavigateToLogin }) {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/verify/${token}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Verification failed.');
        }

        setStatus('success');
        setMessage('Your email has been verified successfully!');
      } catch (err) {
        setStatus('error');
        setMessage(err.message);
      }
    };

    if (token) {
      verify();
    } else {
      setStatus('error');
      setMessage('No verification token provided.');
    }
  }, [token]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] justify-center p-6 animate-in fade-in duration-500">
      <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl border border-leather/10 shadow-xl relative h-auto min-h-fit text-center">
        {status === 'verifying' && (
          <div className="flex flex-col items-center gap-4">
            <span className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></span>
            <h1 className="text-2xl font-extrabold text-leather tracking-tight">Verifying your email...</h1>
            <p className="text-ink/60 font-medium">Please wait a moment.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <h1 className="text-2xl font-extrabold text-leather tracking-tight">Email Verified!</h1>
            <p className="text-ink/60 font-medium">{message}</p>
            <button
              onClick={onNavigateToLogin}
              className="mt-4 bg-leather text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Go to Login
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="w-16 h-16 text-red-400" />
            <h1 className="text-2xl font-extrabold text-leather tracking-tight">Verification Failed</h1>
            <p className="text-ink/60 font-medium">{message}</p>
            <button
              onClick={onNavigateToLogin}
              className="mt-4 bg-leather text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Go to Login
            </button>
          </div>
        )}

        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </div>
  );
}
