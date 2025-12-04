import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            // If VITE_API_URL is set, use it (remove /api suffix if present for proxy target)
            // Otherwise, default to localhost for local development
            target: env.VITE_API_URL 
              ? env.VITE_API_URL.replace(/\/api$/, '') 
              : 'http://localhost:5000',
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path, // Keep /api in the path
          }
        }
      },
      plugins: [
        react(),
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      },
      build: {
        // Enable minification (esbuild is faster and doesn't require additional dependencies)
        minify: 'esbuild',
        // Remove console.log in production using esbuild
        esbuildOptions: {
          drop: mode === 'production' ? ['console', 'debugger'] : [],
        },
        // Optimize chunk size
        chunkSizeWarningLimit: 1000,
        // Enable source maps only in development
        sourcemap: mode === 'development',
        // Target modern browsers for smaller bundles
        target: 'es2015',
        rollupOptions: {
          output: {
            // Optimize chunk names
            chunkFileNames: 'assets/js/[name]-[hash].js',
            entryFileNames: 'assets/js/[name]-[hash].js',
            assetFileNames: (assetInfo) => {
              const info = assetInfo.name.split('.');
              const ext = info[info.length - 1];
              if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
                return `assets/images/[name]-[hash][extname]`;
              }
              if (/woff2?|eot|ttf|otf/i.test(ext)) {
                return `assets/fonts/[name]-[hash][extname]`;
              }
              return `assets/${ext}/[name]-[hash][extname]`;
            },
            manualChunks: (id) => {
              // Vendor chunking for better caching
              if (id.includes('node_modules')) {
                // React DOM in its own chunk (check before react to avoid conflicts)
                if (id.includes('react-dom')) {
                  return 'react-dom';
                }
                // React in its own chunk (but not react-dom)
                if (id.includes('react') && !id.includes('react-dom')) {
                  return 'react';
                }
                // Framer Motion in its own chunk (lazy load)
                if (id.includes('framer-motion')) {
                  return 'framer-motion';
                }
                // Router in its own chunk
                if (id.includes('react-router')) {
                  return 'react-router';
                }
                // Axios in its own chunk
                if (id.includes('axios')) {
                  return 'axios';
                }
                // Other vendor libraries
                return 'vendor';
              }
            }
          }
        },
        // Enable CSS code splitting
        cssCodeSplit: true,
        // Optimize assets
        assetsInlineLimit: 4096, // Inline assets smaller than 4kb
      },
      // Optimize dependencies
      optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom'],
        exclude: ['framer-motion'], // Exclude framer-motion from pre-bundling to lazy load it
      },
    };
});
