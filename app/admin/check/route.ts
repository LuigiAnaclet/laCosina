import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { password } = await req.json();
  const secret = process.env.ADMIN_SECRET;

  if (password === secret) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
