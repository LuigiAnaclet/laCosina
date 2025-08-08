
'use client';
import { useEffect, useState } from 'react';

type Plat = { name: string; description: string };
type Menu = {
  entree: Plat[];
  plat: Plat[];
  dessert: Plat[];
  boisson: Plat[];
};

const sectionConfig = {
  entree: { emoji: '🥗', color: 'bg-green-100 border-green-400', title: 'Entrées' },
  plat: { emoji: '🍛', color: 'bg-orange-100 border-orange-400', title: 'Plats' },
  dessert: { emoji: '🍰', color: 'bg-pink-100 border-pink-400', title: 'Desserts' },
  boisson: { emoji: '🍹', color: 'bg-blue-100 border-blue-400', title: 'Boissons' }
};

export default function MenuDisplay({ menu, tableId, withCart = false }: any) {
  const [cart, setCart] = useState<any[]>([]);
  const [menu, setMenu] = useState<Menu | null>(null);

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => setMenu(data));
  }, []);

  const addToCart = (item: any) => {
    setCart([...cart, item]);
  };

  if (!menu)
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-xl text-white bg-gradient-to-br from-yellow-200 via-red-100 to-pink-200">
        Chargement du menu... 🎉
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-100 px-4 py-6 font-sans text-gray-800">
      <h1 className="text-3xl font-extrabold text-center mb-8 text-orange-700">
        🎊 Menu du jour 🎊
      </h1>

      {/* Section dynamique par type */}
      {Object.entries(menu).map(([key, plats]) => {
        const section = sectionConfig[key as keyof Menu];
        return (
          <section key={key} className="mb-10">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">
              {section.emoji} {section.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(plats as Plat[]).map((item, i) => (
                <div
                  key={i}
                  className={`rounded-xl border-l-4 ${section.color} shadow-sm p-4`}
                >
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  {withCart && (
                  <button
                    className="text-blue-500 text-sm mt-1"
                    onClick={() => addToCart(item)}
                  >
                    Ajouter au panier
                  </button>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
