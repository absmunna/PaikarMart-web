import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: [
        { find: '@/app', replacement: path.resolve(__dirname, './src/app') },
        { find: '@/core', replacement: path.resolve(__dirname, './src/core') },
        { find: '@/design-system', replacement: path.resolve(__dirname, './src/design-system') },
        { find: '@/modules', replacement: path.resolve(__dirname, './src/modules') },
        { find: '@/shared', replacement: path.resolve(__dirname, './src/shared') },
        { find: '@/portals', replacement: path.resolve(__dirname, './src/portals') },
        { find: '@/components', replacement: path.resolve(__dirname, './src/design-system/components') },
        { find: '@/hooks', replacement: path.resolve(__dirname, './src/shared/hooks') },
        { find: '@/types', replacement: path.resolve(__dirname, './src/shared/types') },
        { find: '@/constants', replacement: path.resolve(__dirname, './src/shared/constants') },
        { find: '@/guards', replacement: path.resolve(__dirname, './src/core/auth/guards') },
        { find: '@/permissions', replacement: path.resolve(__dirname, './src/core/auth/permissions') },
        { find: '@/providers', replacement: path.resolve(__dirname, './src/app/providers') },
        { find: '@/router', replacement: path.resolve(__dirname, './src/app/router') },
        { find: '@/services', replacement: path.resolve(__dirname, './src/core/services') },
        { find: '@/store', replacement: path.resolve(__dirname, './src/app/store') },
        { find: '@/context', replacement: path.resolve(__dirname, './src/app/context') },
        { find: '@/lib', replacement: path.resolve(__dirname, './src/core/lib') },
        { find: '@/api', replacement: path.resolve(__dirname, './src/core/api') },
        { find: '@/config', replacement: path.resolve(__dirname, './src/core/config') },
        { find: '@/pages', replacement: path.resolve(__dirname, './src/pages') },
        { find: '@backend', replacement: path.resolve(__dirname, '../backend') },
        { find: '@shared', replacement: path.resolve(__dirname, './src/shared') },
        { find: '@modules', replacement: path.resolve(__dirname, './src/modules') },
        { find: '@lib', replacement: path.resolve(__dirname, './src/core/lib') },
        { find: '@ui', replacement: path.resolve(__dirname, './src/design-system/components/ui') },
        { find: '@config', replacement: path.resolve(__dirname, './') },
        { find: 'shared', replacement: path.resolve(__dirname, '../../packages/shared') },
        { find: '@', replacement: path.resolve(__dirname, './src') },
      ],
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-player'],
    },
    build: {
      target: 'esnext',
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'react-vendor';
              }
              if (id.includes('firebase')) {
                return 'firebase-vendor';
              }
              if (id.includes('framer-motion') || id.includes('lucide-react')) {
                return 'ui-vendor';
              }
              if (id.includes('react-player')) {
                return 'media-vendor';
              }
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
