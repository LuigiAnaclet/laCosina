import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const { data, error } = await supabase.from('menu').select('*').order('type').order('id');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
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

  return NextResponse.json(data);
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
  const { id, password } = await req.json();

  if (password !== process.env.ADMIN_SECRET)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error } = await supabase.from('menu').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

