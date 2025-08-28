'use client';

import { useEffect, useState } from 'react';

type Plat = {
  id: number;
  name: string;
  numero: number;
  etat: string;
  created_at: string;
};

export default function CuisineAdminPage() {
  const [plats, setPlats] = useState<Plat[]>([]);
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useState(false);
  const [error, setError] = useState('');
  const adminPassword = process.env.ADMIN_SECRET!;

  useEffect(() => {
    if (sessionStorage.getItem('admin-auth') === 'true') {
      setAuth(true);
      fetchPlats();
      const interval = setInterval(fetchPlats, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const login = async () => {
    const res = await fetch('/api/admin/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      sessionStorage.setItem('admin-auth', 'true');
      sessionStorage.setItem('admin-password', password);
      setAuth(true);
      fetchPlats();
  }else {
      setError('Mot de passe incorrect');
    }
  };

  const handleEtatChange = async (id: number, nouvelEtat: string) => {
    const storedPassword = sessionStorage.getItem('admin-password');
    const res = await fetch("/api/cuisine", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, etat: nouvelEtat, password: storedPassword }), 
    });
  
    const data = await res.json();
  
    if (data.success) {
      fetchPlats();
    } else {
      console.error("Erreur lors du changement d'état :", data.error);
    }
  };



  const fetchPlats = async () => {
    const res = await fetch('/api/cuisine');
    const data = await res.json();
    setPlats(data);
  };

  return (
    <main className="max-w-3xl mx-auto p-4">
      {!auth ? (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <h1 className="text-2xl font-bold mb-4">Connexion admin 🔐</h1>
          <input
            type="password"
            placeholder="Mot de passe admin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full max-w-sm mb-2"
          />
          <button
            onClick={login}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Se connecter
          </button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">👨‍🍳 Plats à préparer</h1>
          {plats.length === 0 ? (
            <p className="text-gray-600">Aucune commande en attente.</p>
          ) : (
            <ul className="space-y-3">
              {plats.map((plat) => (
                <li
                  key={plat.id}
                  className="border p-3 rounded bg-white shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-semibold">{plat.name}</p>
                    <p className="text-sm text-gray-500">
                      Table {plat.numero} ·{' '}
                      {new Date(plat.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                onClick={() =>
                  handleEtatChange(
                    plat.id,
                    plat.etat === 'en préparation' ? 'fait' : 'en préparation'
                  )
                }
                className={`px-4 py-2 rounded text-white ${
                  plat.etat === 'en préparation' ? "bg-orange-500" : "bg-green-600"
                }`}
              >
                Marquer comme {plat.etat === 'en préparation' ? 'fait' : 'en préparation'}
              </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
