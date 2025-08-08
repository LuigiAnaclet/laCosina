'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import MenuDisplay from '@/components/MenuDisplay';

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

  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase.from('menu').select('*');

      if (error) {
        console.error('Erreur lors de la récupération du menu :', error.message);
        return;
      }

      const grouped: GroupedMenu = {};

      data?.forEach((item) => {
        if (!grouped[item.type]) grouped[item.type] = [];
        grouped[item.type].push(item);
      });

      setMenu(grouped);
    };

    fetchMenu();

    // Charger panier local
    const savedCart = localStorage.getItem(`cart-table-${id}`);
    if (savedCart) setCart(JSON.parse(savedCart));
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Table {id}</h1>

      <MenuDisplay menu={menu} onAddToCart={addToCart} />

      <div className="mt-8">
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
      </div>
    </div>
  );
}
