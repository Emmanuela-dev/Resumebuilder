import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
   rollupOptions: {
     onwarn(warning, warn) {
       // Suppress all warnings
       return;
     },
     output: {
       manualChunks: {
         'vendor-react': ['react', 'react-dom', 'react-router-dom'],
         'vendor-supabase': ['@supabase/supabase-js'],
         'vendor-ui': ['lucide-react', 'react-hot-toast'],
         'vendor-export': ['jspdf', 'html2canvas', 'file-saver'],
         'vendor-form': ['zustand', 'date-fns']
       }
     }
   },
   chunkSizeWarningLimit: 1000,
   // Continue build even if there are errors
   minify: 'terser',
   css: {
     minify: false
   },
   terserOptions: {
     compress: {
       drop_console: false,
       drop_debugger: false
     }
   }
 },
  // Don't fail on errors during development
  logLevel: 'info'
})
