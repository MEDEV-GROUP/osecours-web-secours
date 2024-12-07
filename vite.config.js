import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API pour masquer l'URL réelle
      '/api': {
        target: 'https://o-secours-api.medev-group.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    sourcemap: false, // Désactiver les sourcemaps en production
    minify: 'terser', // Minifier le code pour le rendre moins lisible
  },
  envPrefix: 'VITE_', // Préfixe des variables d'environnement
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
