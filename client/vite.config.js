import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Ensures Vite runs on a port Heroku expects
  },
  build: {
    outDir: 'dist', // Ensure it builds to the right directory
  }
});
