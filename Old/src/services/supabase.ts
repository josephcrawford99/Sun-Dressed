import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zexaqrlmitxdjnolndld.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpleGFxcmxtaXR4ZGpub2xuZGxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NTM3NDksImV4cCI6MjA2MTQyOTc0OX0.5XuWjjNLBD4WEb8CecTiRRUd7ITE2JXxR8qBxZ15D08';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
