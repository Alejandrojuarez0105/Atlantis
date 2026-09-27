// Solo servidor: usa la service_role key. Si algún componente del navegador
// llegara a importar este archivo, el build falla en vez de filtrar la key.
import "server-only";
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
