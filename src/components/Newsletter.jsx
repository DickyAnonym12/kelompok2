import React, { useState } from 'react';
import axios from 'axios';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setStatus('invalid');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/subscriber', { email });
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-12 px-4 bg-gradient-to-b from-white to-gray-50">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 text-center">Newsletter</h2>
      <p className="text-gray-500 mb-6 text-center max-w-xl">Subscribe to get updates, tips, and exclusive content straight to your inbox.</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center w-full max-w-xl gap-3">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email"
          className="w-full sm:w-auto flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-base"
          disabled={loading}
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {status === 'success' && <p className="text-green-600 mt-3">Berhasil subscribe! Cek email Anda.</p>}
      {status === 'error' && <p className="text-red-600 mt-3">Gagal subscribe. Email sudah terdaftar atau server error.</p>}
      {status === 'invalid' && <p className="text-red-600 mt-3">Masukkan email yang valid.</p>}
    </div>
  );
} 