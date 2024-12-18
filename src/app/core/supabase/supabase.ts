import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';

const supabaseClient = createClient(
  environment.SUPABASE.PROJECT_URL,
  environment.SUPABASE.API_KEY
);

export { supabaseClient };
