'use client';

import { useEffect, useState } from 'react';

type Plat = {
  id: number;
  name: string;
  description: string;
  type: 'entree' | 'plat' | 'dessert' | 'boisson';
};

type Menu = {
  entree: Plat[];
  plat: Plat[];
  dessert: Plat[];
  boisson: Plat[];
};

export default function AdminMenuPage() {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [form, setForm] = useState({ name: '', description: '', type: 'plat' });
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('admin-auth') === 'true') {
      setAuth(true);
      fetchMenu();
    }
  }, []);

  const fetchMenu = async () => {
    const res = await fetch('/api/menu');
    const data = await res.json();
    setMenu(data);
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
      fetchMenu();
    } else {
      setError('Mot de passe incorrect');
    }
  };

  const handleAdd = async () => {
    const res = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, password })
    });

    if (!res.ok) {
      alert('Erreur ajout');
      return;
    }

    setForm({ name: '', description: '', type: 'plat' });
    fetchMenu();
  };

  const handleDelete = async (id: number) => {
  const res = await fetch(`/api/menu?id=${id}&password=${password}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    alert('Erreur suppression');
    return;
  }

  fetchMenu();
};


  if (!auth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-2xl font-bold mb-4">Connexion admin</h1>
        <input
          type="password"
          placeholder="Mot de passe"
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
      <h1 className="text-2xl font-bold mb-4">Gestion du menu 🍽️</h1>

      <div className="mb-6 space-y-2">
        <input
          name="name"
          placeholder="Nom"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <select
          name="type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="entree">Entrée</option>
          <option value="plat">Plat</option>
          <option value="dessert">Dessert</option>
          <option value="boisson">Boisson</option>
        </select>
        <button onClick={handleAdd} className="w-full bg-green-600 text-white py-2 rounded">
          ➕ Ajouter au menu
        </button>
      </div>

      {menu &&
        Object.entries(menu).map(([type, items]) => (
          <div key={type} className="mb-6">
            <h2 className="text-xl font-semibold capitalize mb-2">{type}s :</h2>
            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center bg-white p-2 border rounded shadow"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500">
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}
