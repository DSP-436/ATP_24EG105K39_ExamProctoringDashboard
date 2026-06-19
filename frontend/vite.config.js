import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://atp-24eg105k39-examproctoringdashboard.onrender.com',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'https://atp-24eg105k39-examproctoringdashboard.onrender.com',
        ws: true,
      },
    },
  },
});
