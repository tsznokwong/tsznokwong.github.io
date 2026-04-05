import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react({
        jsxRuntime: 'classic',
    })],
    server: {
        port: 3000,
        open: true,
    },
    build: {
        outDir: 'build',
        sourcemap: true,
        rollupOptions: {
            output: {
                // Ensure 404.html is created for GitHub Pages routing
                manualChunks: undefined,
            },
        },
    },
    base: '/',
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            reportsDirectory: 'coverage',
            include: ['src/**/*'],
            exclude: ['src/**/*.test.tsx', 'src/**/*.test.ts', 'src/**/index.ts'],
         },
     },
})
