import path from 'path';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function cssBeforeJs(): Plugin {
  return {
    name: 'css-before-js',
    transformIndexHtml(html) {
      const scriptMatch = html.match(/<script type="module" crossorigin src="[^"]+"><\/script>/);
      const linkMatch = html.match(/<link rel="stylesheet" crossorigin href="[^"]+">/);
      
      if (scriptMatch && linkMatch) {
        html = html.replace(scriptMatch[0], '');
        html = html.replace(linkMatch[0], '');
        html = html.replace('</head>', `  ${linkMatch[0]}\n  ${scriptMatch[0]}\n</head>`);
      }
      return html;
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    appType: 'spa',
    server: {
      port: 5000,
      host: '0.0.0.0',
      allowedHosts: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
        '/objects': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    plugins: [react(), cssBeforeJs()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '@assets': path.resolve(__dirname, 'attached_assets'),
      }
    }
  };
});
