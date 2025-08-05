'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (res.ok) {
      sessionStorage.setItem('admin-auth', 'true');
      router.push('/admin');
    } else {
      setError('Mot de passe incorrect');
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Connexion admin</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border"
        />
        <button type="submit" className="w-full bg-black text-white py-2 rounded">
          Se connecter
        </button>
      </form>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
