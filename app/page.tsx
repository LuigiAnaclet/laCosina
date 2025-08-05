'use client';
import { useEffect, useState } from 'react';

type Plat = { name: string; description: string };
type Menu = {
  entree: Plat[];
  plat: Plat[];
  dessert: Plat[];
  boisson: Plat[];
};

export default function HomePage() {
  const [menu, setMenu] = useState<Menu | null>(null);

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => setMenu(data));
  }, []);

  if (!menu) return <p className="p-4">Chargement du menu...</p>;

  return (
    <div className="p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4">Menu du jour</h1>

      <section>
        <h2 className="text-xl font-semibold mt-4">Entrées :</h2>
        {menu.entree.map((e, i) => (
          <div key={i} className="mb-2">
            <h3 className="font-medium">{e.name}</h3>
            <p>{e.description}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4">Plats :</h2>
        {menu.plat.map((p, i) => (
          <div key={i} className="mb-2">
            <h3 className="font-medium">{p.name}</h3>
            <p>{p.description}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4">Desserts :</h2>
        {menu.dessert.map((d, i) => (
          <div key={i} className="mb-2">
            <h3 className="font-medium">{d.name}</h3>
            <p>{d.description}</p>
          </div>
        ))}
      </section>

      <section>
      <h2 className="text-xl font-semibold mt-4">Boissons :</h2>
      {menu.boisson.map((b, i) => (
        <div key={i} className="mb-2">
          <h3 className="font-medium">{b.name}</h3>
          <p>{b.description || ''}</p>
        </div>
      ))}
    </section>
    </div>
  );
}
