import { defineConfig } from 'vite';
// (relative paths, so the build runs from any folder: GitHub Pages, a static host, or an APK's web view)
export default defineConfig({ base: './', build: { target: 'es2022', chunkSizeWarningLimit: 6000 } });
