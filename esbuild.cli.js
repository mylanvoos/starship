// esbuild.cli.js
import { build } from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

build({
  entryPoints: [path.join(__dirname, 'src', 'cli', 'create-starship-app.js')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: path.join(__dirname, 'dist', 'cli', 'create-starship-app.js'),
  external: ['fs', 'path', 'url', 'prompts', 'child_process'],
  sourcemap: true,
  minify: false,
  target: ['node14'], // Adjust based on your Node.js version
}).catch(() => process.exit(1));
