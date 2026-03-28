import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: [
      // Styles alias must come first (more specific)
      {
        find: '@isnan/nextant/styles.css',
        replacement: path.resolve(__dirname, '../src/styles/navigation.css'),
      },
      // Main package alias
      {
        find: '@isnan/nextant',
        replacement: path.resolve(__dirname, '../src/index.js'),
      },
    ],
  },
});
