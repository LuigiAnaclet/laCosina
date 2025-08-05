import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false 
    }
  });

  try {
    await client.connect();
    const res = await client.query('SELECT * FROM menu');
    await client.end();

    return NextResponse.json(res.rows);
  } catch (err) {
    console.error('Erreur connexion DB:', err);
    return NextResponse.json({ error: 'Erreur connexion DB' }, { status: 500 });
  }
}
