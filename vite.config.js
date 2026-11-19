import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Mimics what @tailwindcss/vite v4 does: while transforming the stylesheet,
// register every scanned source file with this.addWatchFile().
const cssDependsOnSources = {
  name: 'css-depends-on-sources',
  transform(code, id) {
    if (!id.endsWith('/style.css')) return;
    for (const name of readdirSync('src')) this.addWatchFile(resolve('src', name));
  },
};

export default defineConfig({
  // Remove the plugin to see the expected behaviour (an HMR update in the last step).
  plugins: [cssDependsOnSources],
});
