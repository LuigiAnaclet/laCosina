import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { numero, items } = body;

  if (!numero || !Array.isArray(items)) {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
  }

  const payload = items.map((item: any) => ({
    name: item.name,
    numero,
    etat: 'en préparation',
    created_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from('cuisine').insert(payload);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const { data, error } = await supabase
    .from('cuisine')
    .select('*')
    .eq('etat', 'en préparation')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const { id, etat, password } = await req.json();
  console.log('Type etat :', typeof etat, JSON.stringify(etat));

  console.log('PATCH cuisine:', { id, etat, password });

  // Protection avec mot de passe
  if (password !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Requête de mise à jour
  const { data, error } = await supabase
    .from('cuisine')
    .update({ etat })
    .eq('id', id)
    .select(); // Pour voir si une ligne a été touchée

  if (error) {
    console.error('Erreur UPDATE Supabase:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    console.warn('Aucune ligne mise à jour pour id =', id);
    return NextResponse.json({ error: 'Aucune ligne mise à jour' }, { status: 404 });
  }

  console.log('Mise à jour réussie pour ID:', id);
  return NextResponse.json({ success: true });
}
