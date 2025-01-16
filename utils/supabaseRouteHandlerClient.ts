import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../lib/database.types";

export const supabaseRouteHandlerClient = async () => {
  const cookieStore = await cookies();
  cookieStore.getAll();
  return createRouteHandlerClient<Database>({ cookies });
};