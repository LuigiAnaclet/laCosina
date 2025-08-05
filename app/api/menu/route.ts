import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  console.log('📡 Tentative de connexion à Supabase...');

  const { data, error } = await supabase
    .from('menu')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Erreur de connexion ou requête Supabase échouée :', error.message);
    return NextResponse.json({ error: 'Erreur de récupération depuis Supabase' }, { status: 500 });
  }

  if (!data || data.length === 0) {
    console.warn('⚠️ Connexion réussie, mais aucune donnée dans la table `menu`');
    return NextResponse.json({ error: 'Aucune donnée trouvée' }, { status: 404 });
  }

  console.log('✅ Connexion à Supabase réussie. Données récupérées :', data);

  // 🔁 Grouper les données par type
  const grouped = {
    entree: [] as any[],
    plat: [] as any[],
    dessert: [] as any[],
    boisson: [] as any[],
  };

  for (const item of data) {
    const type = item.type as keyof typeof grouped;
    if (grouped[type]) {
      grouped[type].push({
        nom: item.name,
        description: item.description || '',
      });
    }
  }

  return NextResponse.json(grouped);
}
