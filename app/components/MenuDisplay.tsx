'use client';
import { useState, useMemo } from 'react';

type Plat = { name: string; description: string; type: string };

const sectionConfig = {
  entree: { emoji: '🥗', color: 'bg-green-100 border-green-400', title: 'Entrées' },
  plat: { emoji: '🍛', color: 'bg-orange-100 border-orange-400', title: 'Plats' },
  dessert: { emoji: '🍰', color: 'bg-pink-100 border-pink-400', title: 'Desserts' },
  boisson: { emoji: '🍹', color: 'bg-blue-100 border-blue-400', title: 'Boissons' }
};

export default function MenuDisplay({
  menu,
  tableId,
  withCart = false
}: {
  menu: Plat[];
  tableId: string;
  withCart?: boolean;
}) {
  const [cart, setCart] = useState<Plat[]>([]);

  const menuGrouped = useMemo(() => {
    const grouped: Record<string, Plat[]> = {};
    menu.forEach((item) => {
      if (!grouped[item.type]) grouped[item.type] = [];
      grouped[item.type].push(item);
    });
    return grouped;
  }, [menu]);

  const addToCart = (item: Plat) => {
    setCart([...cart, item]);
  };

  if (!menu || menu.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-xl text-white bg-gradient-to-br from-yellow-200 via-red-100 to-pink-200">
        Aucun plat disponible... 🍽️
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-100 px-4 py-6 font-sans text-gray-800">
      <h1 className="text-3xl font-extrabold text-center mb-8 text-orange-700">
        🎊 Menu du jour 🎊
      </h1>

      {Object.entries(menuGrouped).map(([key, plats]) => {
        const section = sectionConfig[key as keyof typeof sectionConfig];
        if (!section) return null;

        return (
          <section key={key} className="mb-10">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">
              {section.emoji} {section.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plats.map((item, i) => (
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
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
