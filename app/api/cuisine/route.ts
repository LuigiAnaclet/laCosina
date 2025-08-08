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
    created_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from('cuisine').insert(payload);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
