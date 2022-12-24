import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY as string;
const options = {
  db: {
    schema: 'public',
  }
}
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, options)

export default supabase;