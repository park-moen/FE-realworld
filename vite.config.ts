/// <reference types="vitest" />
import path from 'path';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      ...(isDevelopment ? [basicSsl()] : []),
      vanillaExtractPlugin({
        identifiers: mode === 'production' ? 'short' : 'debug',
      }),
    ],

    server: {
      port: 5173,
      ...(isDevelopment && {
        proxy: {
          '/api': {
            target: env.VITE_BACKEND_URL,
            changeOrigin: true,
            secure: true,
            rewrite: (pathUrl) => {
              console.log(`[Proxy] ${pathUrl} -> ${env.VITE_BACKEND_URL}${pathUrl}`);

              return pathUrl;
            },
          },
        },
      }),
    },

    // Vite Path Alias 설정
    resolve: {
      alias: {
        '~app': path.resolve(__dirname, './src/app'),
        '~pages': path.resolve(__dirname, './src/pages'),
        '~widgets': path.resolve(__dirname, './src/widgets'),
        '~features': path.resolve(__dirname, './src/features'),
        '~entities': path.resolve(__dirname, './src/entities'),
        '~shared': path.resolve(__dirname, './src/shared'),
      },
    },

    // Vitest 테스트 설정
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/shared/lib/test/setup.ts'],
      globals: true,
      env: {
        VITE_API_URL: '/api', // ← 이것을 추가!
      },
      include: ['src/**/*.{spec,test}.{ts,tsx,js,jsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov'],
        reportsDirectory: './coverage',
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/**/*.d.ts', 'src/**/*.stories.tsx', 'node_modules/', '**/*.config.{ts,js}'],
      },
    },
  };
});
