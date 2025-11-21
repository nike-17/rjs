import { defineConfig } from 'vite';
import { resolve } from 'path';

// For GitHub Pages deployment
const isProd = process.env.NODE_ENV === 'production';
// Use '/rjs' without trailing slash for GitHub Pages
const basePath = isProd ? '/rjs' : '/';

export default defineConfig({
  base: basePath,
  // For GitHub Pages deployment
  define: {
    'import.meta.env.BASE_URL': JSON.stringify(basePath)
  },
  root: 'public',
  publicDir: 'public',
  server: {
    port: 3000,
    open: true,
    fs: {
      allow: ['..']
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html')
      },
      output: {
        // Ensure consistent hashes for better caching
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]'
      }
    },
    // Generate sourcemaps for better debugging
    sourcemap: true,
    // Minify the output for production
    minify: isProd ? 'terser' : false,
    // Enable gzip compression
    brotliSize: true
  },
  // Optimize dependencies for production
  optimizeDeps: {
    include: ['lucide-vue-next']
  },
  // Configure development server
  preview: {
    port: 3001
  }
});
