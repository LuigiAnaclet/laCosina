'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TableAdminPage() {
  type Table = {
  id: number;
  numero: number;
  };
  const [tables, setTables] = useState<Table[]>([]);
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem('admin-auth') === 'true') {
      setAuth(true);
      fetchTables();
    }
  }, []);

  const fetchTables = async () => {
    const res = await fetch('/api/tables');
    const data = await res.json();
    setTables(data);
  };

  const login = async () => {
    const res = await fetch('/api/admin/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    if (res.ok) {
      sessionStorage.setItem('admin-auth', 'true');
      setAuth(true);
      fetchTables();
    } else {
      setError('Mot de passe incorrect');
    }
  };

  const addTable = async () => {
    await fetch('/api/tables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    fetchTables();
  };

  const deleteTable = async (id: number) => {
    await fetch('/api/tables', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password })
    });
    fetchTables();
  };

  if (!auth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-2xl font-bold mb-4">Connexion admin 🔐</h1>
        <input
          type="password"
          placeholder="Mot de passe admin"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full max-w-sm mb-2"
        />
        <button onClick={login} className="bg-black text-white px-4 py-2 rounded">
          Se connecter
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des tables 🍽️</h1>
      <button
        onClick={addTable}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        ➕ Ajouter une table
      </button>

      <ul className="space-y-3">
        {tables.map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between bg-white p-3 rounded shadow border"
          >
            <span>🪑 Table {t.numero}</span>
            <button
              onClick={() => deleteTable(t.id)}
              className="text-red-500 hover:text-red-700"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
