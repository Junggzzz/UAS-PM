import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xuzgjvqnwwvbdzgdfhur.supabase.co";
const supabaseAnonKey = "sb_publishable_gjGI5O3tfvroTas4JuowAg_eYIUGt13";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);