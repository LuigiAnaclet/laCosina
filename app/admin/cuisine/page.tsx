"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CuisineAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isAuthorized) {
      fetchItems();
      const interval = setInterval(fetchItems, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthorized]);

  const fetchItems = async () => {
    const res = await fetch("/api/cuisine", {
      headers: {
        Authorization: password,
      },
    });
    const data = await res.json();
    if (!data.error) setItems(data);
  };

  const handleEtatChange = async (id: number, etat: string) => {
    const res = await fetch("/api/cuisine", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, etat }),
    });
    const data = await res.json();
    if (!data.error) fetchItems();
  };

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      setIsAuthorized(true);
    } else {
      alert("Mot de passe incorrect");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl mb-4">Accès cuisine protégé</h1>
        <input
          type="password"
          placeholder="Mot de passe admin"
          className="border px-4 py-2 mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Cuisine - Commandes en cours</h1>
      {items.length === 0 ? (
        <p className="text-gray-500">Aucune commande pour le moment.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold">{item.nom}</p>
                <p className="text-sm text-gray-500">
                  Table n° {item.numero} | {item.etat}
                </p>
              </div>
              <button
                onClick={() =>
                  handleEtatChange(
                    item.id,
                    item.etat === "en préparation" ? "fait" : "en préparation"
                  )
                }
                className={`px-4 py-2 rounded text-white ${
                  item.etat === "en préparation" ? "bg-orange-500" : "bg-green-600"
                }`}
              >
                Marquer comme {item.etat === "en préparation" ? "fait" : "en préparation"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
