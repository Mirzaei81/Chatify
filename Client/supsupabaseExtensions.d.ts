declare module '@supabase/postgrest-js' {
  interface PostgrestFilterBuilder<T, C, I, S, Single> {
    join(table: string, column1: string, operator: string, column2: string): this;
  }
}
