import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const sourcePath = new URL('./src', import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, '$1');

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': sourcePath } },
  server: { port: 4173 },
  preview: { port: 4173 },
});
