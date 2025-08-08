import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    cookies: {
      get: (key) => cookies().get(key)?.value,
    },
  });


