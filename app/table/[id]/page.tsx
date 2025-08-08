
'use client';

import { useEffect, useState } from 'react';

type MenuItem = {
  id: number;
  name: string;
  description: string;
  type: string;
};

type Menu = {
  [key: string]: MenuItem[];
};

export default function TablePage({ params }: { params: { id: string } }) {
  const [menu, setMenu] = useState<Menu>({});
  const [cart, setCart] = useState<MenuItem[]>([]);

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => setMenu(data));
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart(prev => [...prev, item]);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Table {params.id}</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          {Object.entries(menu).map(([type, items]) => (
            <div key={type} className="mb-6">
              <h2 className="text-xl font-semibold capitalize mb-2">{type}s</h2>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item.id} className="bg-white p-3 shadow rounded flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Ajouter
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-3">🧺 Panier</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Votre panier est vide.</p>
          ) : (
            <ul className="space-y-2">
              {cart.map((item, index) => (
                <li key={index} className="bg-white p-2 flex justify-between items-center rounded">
                  <span>{item.name}</span>
                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
