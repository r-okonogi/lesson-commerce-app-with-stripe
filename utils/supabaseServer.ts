import { Database } from "../lib/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const supabaseServer = async () => {
  (await cookies()).getAll();
  return createServerComponentClient<Database>({ cookies });
};