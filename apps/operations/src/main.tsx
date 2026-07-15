import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from '@/app/App';
import { ThemeProvider } from '@/app/ThemeProvider';
import { AuthProvider } from '@/features/auth/AuthContext';
import '@/styles/global.css';

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 20000, gcTime: 600000, retry: false, refetchOnReconnect: true, refetchOnWindowFocus: true }, mutations: { retry: false } } });
createRoot(document.getElementById('root')!).render(<StrictMode><ThemeProvider><QueryClientProvider client={queryClient}><BrowserRouter><AuthProvider><App /></AuthProvider></BrowserRouter></QueryClientProvider></ThemeProvider></StrictMode>);
