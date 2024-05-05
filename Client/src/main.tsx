import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './routes/App'
import './index.css'
import { Toaster } from 'react-hot-toast'
import {BrowserRouter,} from 'react-router-dom'
import { QueryClient,QueryClientProvider } from 'react-query'
import { createClient } from '@supabase/supabase-js'
import {Database} from "../types/supabase"
import { SupabaseQueryProvider } from 'supabase-query'
import AuthProvider from './context/AuthProvider'
import { ThemeProvider } from './components/ui/theme-provider'


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey);
const queryClient= new QueryClient()
 
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
<React.StrictMode>
  <AuthProvider>
    <BrowserRouter>
    <SupabaseQueryProvider client={supabaseClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
        </ThemeProvider>
      </QueryClientProvider>
      </SupabaseQueryProvider>
      <Toaster
        position='bottom-right'
        reverseOrder={false}
      />
    </BrowserRouter>
  </AuthProvider>
</React.StrictMode>
)
