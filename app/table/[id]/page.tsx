import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import MenuDisplay from '../../components/MenuDisplay';

export const dynamicParams = false;

export async function generateStaticParams() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from('tables').select('id');

  if (error || !data) return [];

  return data.map((table: { id: number }) => ({
    id: table.id.toString(),
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `Menu - Table ${params.id}`,
  };
}

export default async function TableMenuPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: menu, error } = await supabase.from('menu').select('*');

  if (!menu || error) {
    return notFound();
  }

  return (
    <main className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Menu - Table {id}</h1>
      <MenuDisplay menu={menu} tableId={id} withCart />
    </main>
  );
}
