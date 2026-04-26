import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, User, FileText, Link } from 'lucide-react';

export default function EditProfile({ currentUser, onSave, onBack }) {
  const [name, setName] = useState(currentUser?.name || '');
  const [tagline, setTagline] = useState(currentUser?.tagline || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('booktwin_token');
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: name.trim(), tagline: tagline.trim(), bio: bio.trim(), avatar: avatar.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile.');
      }

      onSave(data);
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
          Edit Profile
        </h1>
        <p className="text-ink/60 font-medium">
          Update your personal information.
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-6 pb-10 rounded-3xl border border-leather/10 shadow-xl relative h-auto min-h-fit">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {/* Avatar Preview */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-leather/20 border-4 border-white shadow-lg overflow-hidden ring-2 ring-accent/20">
            <img
              src={avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${currentUser?.email}`}
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-leather px-1">Display Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Austen"
                className="w-full p-3.5 pl-10 rounded-xl border border-leather/20 bg-white/50 focus:bg-white focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-ink/30"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-leather px-1">Tagline</label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="A fellow reader seeking new worlds."
                className="w-full p-3.5 pl-10 rounded-xl border border-leather/20 bg-white/50 focus:bg-white focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-ink/30"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-leather px-1">Bio</label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-ink/30" />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself and your reading journey..."
                rows={3}
                className="w-full p-3.5 pl-10 rounded-xl border border-leather/20 bg-white/50 focus:bg-white focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-ink/30 resize-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-leather px-1">Avatar URL</label>
            <div className="relative">
              <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://example.com/your-photo.jpg"
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
                Save Changes <ChevronRight className="w-5 h-5" strokeWidth={3} />
              </>
            )}
          </button>
        </form>

        <button
          onClick={onBack}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 text-sm font-bold text-ink/60 hover:text-leather transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel
        </button>

        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </div>
  );
}
