import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'vercel-api-mock',
        configureServer(server) {
          server.middlewares.use('/api/create-payment-intent', async (req, res, next) => {
            try {
              const modulePath = path.join(process.cwd(), 'api', 'create-payment-intent.js');
              // Clear require cache for hot reloading
              delete require.cache[require.resolve(modulePath)];
              const handler = require(modulePath);

              if (req.method === 'POST') {
                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', async () => {
                  try {
                    if (body) (req as any).body = JSON.parse(body);
                  } catch (e) {
                    res.statusCode = 400;
                    return res.end(JSON.stringify({ error: 'Invalid JSON' }));
                  }
                  await handler(req, res);
                });
              } else {
                await handler(req, res);
              }
            } catch (err: any) {
              console.error('API Error:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
