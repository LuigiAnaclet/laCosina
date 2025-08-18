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
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const { id, etat } = await req.json();

  if (!id || !etat) {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }

  const { error } = await supabase
    .from('cuisine')
    .update({ etat })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

