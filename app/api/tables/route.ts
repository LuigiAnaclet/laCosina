import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('tables').select('*').order('numero', { ascending: true });

  if (error) {
    console.error('Erreur récupération tables :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== process.env.ADMIN_SECRET)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Cherche tous les numéros existants
  const { data: all, error: getError } = await supabase
    .from('tables')
    .select('numero');

  if (getError) return NextResponse.json({ error: getError.message }, { status: 500 });

  const numeros = (all ?? []).map((t) => t.numero);
  let numero = 1;
  while (numeros.includes(numero)) {
    numero++;
  }

  const { error } = await supabase.from('tables').insert({ numero });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
