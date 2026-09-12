import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { configDefaults } from 'vitest/config'

// Substituted into index.html's build-sha meta; CI sets the commit SHA.
process.env.VITE_BUILD_SHA ??= 'dev'

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
        // Playwright specs; run via `npm run smoke`.
        exclude: [...configDefaults.exclude, 'e2e/**'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            reportsDirectory: 'coverage',
            include: ['src/**/*'],
            exclude: ['src/**/*.test.tsx', 'src/**/*.test.ts', 'src/**/index.ts'],
         },
     },
})
