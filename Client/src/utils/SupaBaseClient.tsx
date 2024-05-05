import { createClient } from "@supabase/supabase-js";
import { useMemo } from "react";
import { Database } from "../../types/supabase"
import {
  TypedUseSupabaseMutation,
  TypedUseSupabaseQuery,
  useSupabaseMutation,
  useSupabaseQuery,
} from "supabase-query";

export const useTypedSupabaseQuery: TypedUseSupabaseQuery<Database> =
  useSupabaseQuery;
export const useTypedSupabaseMutation: TypedUseSupabaseMutation<Database> =
  useSupabaseMutation;

