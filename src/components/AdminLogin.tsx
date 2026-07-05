import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Lock, X } from 'lucide-react';

interface AdminLoginProps {
  onClose: () => void;
  isDarkMode?: boolean;
}

export default function AdminLogin({ onClose, isDarkMode = false }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (err: any) {
      console.error(err);
      // Firebase errors usually have the format "Firebase: Error (auth/...)."
      // Let's strip it to just the useful part, or just show the whole thing.
      let errorMsg = err.message || 'An error occurred';
      if (errorMsg.includes('auth/invalid-credential')) {
        errorMsg = 'Incorrect email or password.';
      } else if (errorMsg.includes('auth/user-not-found')) {
        errorMsg = 'No admin account found with this email.';
      } else if (errorMsg.includes('auth/wrong-password')) {
        errorMsg = 'Incorrect password.';
      } else if (errorMsg.includes('auth/too-many-requests')) {
        errorMsg = 'Too many failed attempts. Try again later.';
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`relative w-full max-w-sm p-6 rounded-2xl shadow-2xl ${isDarkMode ? 'bg-stone-900 border border-stone-800' : 'bg-white border border-stone-200'}`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors ${isDarkMode ? 'hover:bg-stone-800 text-stone-400' : 'hover:bg-stone-100 text-stone-500'}`}
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-pink-500/10 rounded-xl">
            <Lock className="w-6 h-6 text-pink-500" />
          </div>
          <h2 className={`text-lg font-serif font-bold ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>Admin Access</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className={`block text-xs font-semibold mb-1 tracking-widest ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-pink-500 transition-colors ${
                isDarkMode ? 'bg-stone-950 border-stone-800 text-stone-200' : 'bg-white border-stone-200 text-stone-800'
              }`}
            />
          </div>
          <div>
            <label className={`block text-xs font-semibold mb-1 tracking-widest ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-pink-500 transition-colors ${
                isDarkMode ? 'bg-stone-950 border-stone-800 text-stone-200' : 'bg-white border-stone-200 text-stone-800'
              }`}
            />
          </div>
          
          {error && (
            <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-bold tracking-widest transition-colors disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
}
