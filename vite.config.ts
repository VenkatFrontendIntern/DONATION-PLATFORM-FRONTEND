import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { imagetools } from 'vite-imagetools';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: env.VITE_API_URL
            ? env.VITE_API_URL.replace(/\/api$/, '')
            : 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
        }
      }
    },
    plugins: [
      react(),
      imagetools({
        defaultDirectives: () => new URLSearchParams('format=webp;quality=85'),
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    build: {
      minify: 'esbuild',
      cssMinify: true,
      esbuildOptions: {
        drop: mode === 'production' ? ['console', 'debugger'] : [],
        legalComments: 'none',
        minifyIdentifiers: true,
        minifySyntax: true,
        minifyWhitespace: true,
      },
      chunkSizeWarningLimit: 1000,
      sourcemap: mode === 'development',
      target: 'es2015',
      rollupOptions: {
        output: {
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
            if (id.includes('node_modules')) {
              if (id.includes('react-dom')) {
                return 'react-dom';
              }
              if (id.includes('react') && !id.includes('react-dom')) {
                return 'react';
              }
              if (id.includes('framer-motion')) {
                return 'framer-motion';
              }
              if (id.includes('react-router')) {
                return 'react-router';
              }
              if (id.includes('axios')) {
                return 'axios';
              }
              return 'vendor';
            }
          }
        }
      },
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react'],
    },
  };
});
