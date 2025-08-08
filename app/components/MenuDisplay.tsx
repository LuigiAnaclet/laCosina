'use client';

import React from 'react';

type MenuItem = {
  id: number;
  name: string;
  type: string;
  description: string;
};

type Props = {
  menu: {
    [type: string]: MenuItem[];
  };
  onAddToCart: (item: MenuItem) => void;
};

const getEmoji = (type: string) => {
  switch (type) {
    case 'boisson':
      return '🥤';
    case 'plat':
      return '🍽️';
    case 'dessert':
      return '🍰';
    case 'entree':
      return '🥗';
    default:
      return '🍴';
  }
};

export default function MenuDisplay({ menu, onAddToCart }: Props) {
  return (
    <div className="space-y-8">
      {Object.entries(menu).map(([type, items]) => (
        <div key={type}>
          <h2 className="text-xl font-semibold mb-2 capitalize">
            {getEmoji(type)} {type}s
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded shadow-md flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  )}
                </div>

                <button
                  onClick={() => onAddToCart(item)}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded"
                >
                  Ajouter au panier
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
