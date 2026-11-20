import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copyStaticAssetsPlugin() {
  return {
    name: 'copy-static-images',
    closeBundle() {
      const nojekyllSrc = path.resolve(__dirname, '.nojekyll');
      const nojekyllDest = path.resolve(__dirname, 'dist/.nojekyll');
      if (fs.existsSync(nojekyllSrc)) {
        fs.copyFileSync(nojekyllSrc, nojekyllDest);
      }
      const faviconSrc = path.resolve(__dirname, 'favicon.svg');
      const faviconDest = path.resolve(__dirname, 'dist/favicon.svg');
      if (fs.existsSync(faviconSrc)) {
        fs.copyFileSync(faviconSrc, faviconDest);
      }
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [tailwindcss(), copyStaticAssetsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          quotes: path.resolve(__dirname, 'quotes.html'),
          gallery: path.resolve(__dirname, 'gallery.html'),
          blog: path.resolve(__dirname, 'blog.html'),
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
