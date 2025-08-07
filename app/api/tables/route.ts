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
