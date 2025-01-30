import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
import dotenv from 'dotenv';
import path from 'path';


// Load the root .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const backendPort = process.env.TEMPORARY_PORT || 5000;
console.log("tnaga gasa",backendPort);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()

  ],
  server: {
    proxy: {
      // Proxy requests to /api to your backend server
      '/api': {
        target: `http://localhost:${backendPort}`,  // Backend URL
        secure: false,
      },
      '/uploads/': {
        target: `http://localhost:${backendPort}`,  // Backend URL for serving static files
        secure: false,
        rewrite: (path) => path.replace(/^\/uploads/, ''),
      }
    }
  }
})
