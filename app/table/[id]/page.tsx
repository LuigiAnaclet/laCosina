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
      const { data: tables, error: tableError } = await supabase
        .from('tables')
        .select('numero');

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
      const { data: items, error: menuError } = await supabase
        .from('menu')
        .select('*');

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
    return (
      <main className="min-h-screen grid place-items-center bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50">
        <p className="text-amber-900/80">Chargement…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50">
      <header className="max-w-6xl mx-auto px-4 pt-8 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-amber-900">
          Bienvenue – Table {id}
        </h1>
        <p className="mt-1 text-amber-900/70">
          Découvrez nos {`entrées, plats, desserts et boissons`}, puis validez
          votre commande en un clic.
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-4 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Menu */}
        <div className="lg:col-span-2">
          <MenuDisplay menu={menu} onAddToCart={addToCart} />
        </div>

        {/* Panier */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-6 rounded-2xl bg-white/90 backdrop-blur ring-1 ring-amber-100 shadow-md p-5">
            <h2 className="text-xl font-extrabold text-amber-900 mb-3">
              🛒 Panier
            </h2>

            {cart.length === 0 ? (
              <p className="text-sm text-amber-900/70">
                Aucun article dans le panier.
              </p>
            ) : (
              <ul className="space-y-2">
                {cart.map((item, index) => (
                  <li
                    key={`${item.id}-${index}`}
                    className="flex items-start justify-between gap-3 rounded-xl bg-amber-50 px-3 py-2 ring-1 ring-amber-100"
                  >
                    <span className="text-sm font-medium text-amber-950">
                      {item.name}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs font-semibold text-red-600 hover:text-red-700"
                    >
                      Retirer
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={async () => {
                if (cart.length === 0) return;
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
              className="mt-4 w-full rounded-full px-4 py-3 text-sm font-bold bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-50"
              disabled={cart.length === 0}
            >
              Valider la commande
            </button>
          </div>
        </aside>
      </div>

      <footer className="py-6 text-center text-xs text-amber-900/60">
        Merci pour votre visite 🤎
      </footer>
    </main>
  );
}
