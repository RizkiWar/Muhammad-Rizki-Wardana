import { defineConfig } from 'vite';
import { cpSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const base = process.env.GITHUB_ACTIONS ? '/E_Portofolio_PPG_Prajabatan_2026/' : './';

function copyStaticAssets() {
  return {
    name: 'copy-static-assets',
    closeBundle() {
      const folders = [
        ['assets/pdf', 'assets/pdf']
      ];

      folders.forEach(([sourceDir, targetDir]) => {
        const source = resolve(projectRoot, sourceDir);
        const target = resolve(projectRoot, 'dist', targetDir);

        if (existsSync(source)) {
          cpSync(source, target, { recursive: true });
        }
      });
    }
  };
}

export default defineConfig({
  base,
  plugins: [copyStaticAssets()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 5173,
    strictPort: false
  },
  preview: {
    port: 4173,
    strictPort: false
  }
});
