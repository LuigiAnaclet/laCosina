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
  return NextResponse.json(data[0]); // retourne le premier menu
}
