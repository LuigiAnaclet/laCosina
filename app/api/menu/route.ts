import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
        name: item.name,
        description: item.description || '',
      });
    }
  }

  return NextResponse.json(grouped);
}

export async function POST(req: NextRequest) {
  const { name, description, type, password } = await req.json();

  if (password !== process.env.ADMIN_SECRET)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error } = await supabase.from('menu').insert([{ name, description, type }]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from('menu').delete().eq('id', id);

    if (error) {
      console.error('Erreur Supabase :', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Erreur serveur :', err.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}



