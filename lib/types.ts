import { User as SupabaseUser } from "@supabase/supabase-js";

type DBUser = {
  id: string;
  email?: string;
  name?: string;
};

export type User = SupabaseUser & DBUser;
