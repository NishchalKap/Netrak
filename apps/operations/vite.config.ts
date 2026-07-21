import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const sourcePath = decodeURIComponent(new URL('./src', import.meta.url).pathname).replace(/^\/([A-Za-z]:\/)/, '$1');

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': sourcePath } },
  server: { port: 4173, host: '0.0.0.0' },
  preview: { port: 4173, host: '0.0.0.0' },
});
