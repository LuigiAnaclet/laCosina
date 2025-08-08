'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import MenuDisplay from '../../components/MenuDisplay';

type MenuItem = {
  id: number;
  name: string;
  type: string;
  description: string;
};

type GroupedMenu = {
  [type: string]: MenuItem[];
};

export default function TablePage() {
  const { id } = useParams();
  const [menu, setMenu] = useState<GroupedMenu>({});
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [validTable, setValidTable] = useState<boolean | null>(null);

  useEffect(() => {
    const checkTableAndFetchMenu = async () => {
      // Vérifie si une table avec ce numero existe
      const { data: tables, error: tableError } = await supabase.from('tables').select('numero');

      if (tableError || !tables) {
        console.error('Erreur récupération tables :', tableError?.message);
        setValidTable(false);
        return;
      }

      const tableExists = tables.some((t) => t.numero.toString() === id);

      if (!tableExists) {
        setValidTable(false);
        return;
      }

      setValidTable(true);

      // Récupère le menu
      const { data: items, error: menuError } = await supabase.from('menu').select('*');

      if (menuError || !items) {
        console.error('Erreur récupération menu :', menuError?.message);
        return;
      }

      const grouped: GroupedMenu = {};
      items.forEach((item) => {
        if (!grouped[item.type]) grouped[item.type] = [];
        grouped[item.type].push(item);
      });

      setMenu(grouped);

      // Panier local
      const savedCart = localStorage.getItem(`cart-table-${id}`);
      if (savedCart) setCart(JSON.parse(savedCart));
    };

    checkTableAndFetchMenu();
  }, [id]);

  const addToCart = (item: MenuItem) => {
    const updatedCart = [...cart, item];
    setCart(updatedCart);
    localStorage.setItem(`cart-table-${id}`, JSON.stringify(updatedCart));
  };

  const removeFromCart = (itemId: number) => {
    const updatedCart = cart.filter((item) => item.id !== itemId);
    setCart(updatedCart);
    localStorage.setItem(`cart-table-${id}`, JSON.stringify(updatedCart));
  };

  if (validTable === false) {
    notFound();
  }

  if (validTable === null) {
    return <p className="text-center mt-8">Chargement...</p>;
  }

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Menu - Table {id}</h1>

      <MenuDisplay menu={menu} onAddToCart={addToCart} />

      <div className="mt-10 border-t pt-4">
        <h2 className="text-xl font-semibold mb-2">🛒 Panier</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">Aucun article dans le panier.</p>
        ) : (
          <ul className="space-y-2">
            {cart.map((item, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span>{item.name}</span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Retirer
                </button>
              </li>
            ))}
          </ul>
        )}
            <button
      onClick={async () => {
        const res = await fetch('/api/cuisine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ numero: id, items: cart }),
        });
    
        if (res.ok) {
          alert('Commande envoyée en cuisine 🍽️');
          setCart([]);
          localStorage.removeItem(`cart-table-${id}`);
        } else {
          const err = await res.json();
          alert('Erreur : ' + err.error);
        }
      }}
      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      Valider la commande
    </button>
      </div>
    </main>
  );
}
