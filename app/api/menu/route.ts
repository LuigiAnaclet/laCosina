import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('menu')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Erreur Supabase :', error);
    return NextResponse.json(
      { error: 'Erreur de récupération' },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
