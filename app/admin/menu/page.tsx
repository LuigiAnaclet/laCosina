'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';



export default function AdminPage() {
  const router = useRouter();
useEffect(() => {
  if (sessionStorage.getItem('admin-auth') !== 'true') {
    router.push('/admin/login');
  }
}, []);
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'plat'
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError('');

    const res = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (res.ok) {
      setSuccess(true);
      setForm({ name: '', description: '', type: 'plat' });
    } else {
      setError(data.error || 'Erreur');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ajouter un élément au menu</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Nom" value={form.name} onChange={handleChange} className="w-full p-2 border" required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full p-2 border" />
        <select name="type" value={form.type} onChange={handleChange} className="w-full p-2 border">
          <option value="entree">Entrée</option>
          <option value="plat">Plat</option>
          <option value="dessert">Dessert</option>
          <option value="boisson">Boisson</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Ajouter</button>
      </form>
      {success && <p className="text-green-600 mt-2">Ajouté avec succès !</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
