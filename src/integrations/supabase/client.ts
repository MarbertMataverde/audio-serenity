// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nzutgzasjrnpeqmjmtps.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56dXRnemFzanJucGVxbWptdHBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NTIwNTEsImV4cCI6MjA2MDQyODA1MX0.qt_S0WALyldWQWtYMf5ZgBTwSbaEz0g3_ElRGfqOlbk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);