// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow access from the local network
    port: 5173, // Ensure the port matches your current setup
    strictPort: true // Prevent the server from trying to use a different port
  }
});
