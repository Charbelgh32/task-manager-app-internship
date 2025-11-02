import { createClient } from '@supabase/supabase-js';

const supabaseUrl= 'https://ynkrbazihjpwpwkyisjv.supabase.co';
const supabaseAnonKey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlua3JiYXppaGpwd3B3a3lpc2p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1ODA4OTcsImV4cCI6MjA3NzE1Njg5N30.fVjLebmM0KkN47xbFrq6NYjaQteERCiaKckgDVt_sw4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);