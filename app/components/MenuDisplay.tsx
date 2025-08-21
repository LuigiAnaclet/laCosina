'use client';

import React from 'react';

type MenuItem = {
  id: number;
  name: string;
  type: string;        // 'entree' | 'plat' | 'dessert' | 'boisson'
  description: string;
};

type Props = {
  menu: { [type: string]: MenuItem[] };
  onAddToCart: (item: MenuItem) => void;
};

// Ordre des sections voulu
const TYPE_ORDER = ['entree', 'plat', 'dessert', 'boisson'] as const;

const TITLES: Record<string, string> = {
  entree: 'Entrées',
  plat: 'Plats',
  dessert: 'Desserts',
  boisson: 'Boissons',
};

const EMOJI: Record<string, string> = {
  entree: '🥗',
  plat: '🍽️',
  dessert: '🍰',
  boisson: '🥤',
};

export default function MenuDisplay({ menu, onAddToCart }: Props) {
  // Trie les catégories selon TYPE_ORDER, et à l'intérieur trie les items par nom
  const sections = Object.entries(menu)
    .sort(
      ([a], [b]) =>
        TYPE_ORDER.indexOf(a as any) - TYPE_ORDER.indexOf(b as any)
    )
    .map(([type, items]) => [type, [...items].sort((x, y) => x.name.localeCompare(y.name))] as const)
    .filter(([_, items]) => items.length > 0);

  return (
    <div className="space-y-10">
      {sections.map(([type, items]) => (
        <section key={type}>
          <div className="flex items-baseline gap-2 mb-3">
            <h2 className="text-2xl font-extrabold tracking-tight text-amber-900">
              {EMOJI[type] ?? '🍴'} {TITLES[type] ?? `${type}s`}
            </h2>
            <span className="text-xs px-2 py-1 rounded-full bg-amber-200/70 text-amber-900">
              {items.length} {items.length > 1 ? 'propositions' : 'proposition'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="group rounded-2xl bg-white/90 backdrop-blur shadow-md ring-1 ring-amber-100 hover:shadow-lg transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {item.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onAddToCart(item)}
                  className="mt-4 self-start rounded-full px-4 py-2 text-sm font-semibold bg-amber-700 text-white hover:bg-amber-800 active:scale-[.98] transition"
                >
                  Ajouter au panier
                </button>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
