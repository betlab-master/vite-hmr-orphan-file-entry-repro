# Vite: orphaned file-only module turns HMR into a full reload

A CSS transform registers every file in `src/` with `this.addWatchFile()`, as `@tailwindcss/vite` v4 does for every scanned source file.
`src/probe.js` is also a self-accepting JS module loaded by the page.

After `src/probe.js` is deleted, the stylesheet is transformed again, and the file is recreated,
every edit of `src/probe.js` sends `full-reload` instead of an HMR update.

## Steps

```sh
npm install
npm run dev          # open the page, keep the browser console open
npm run steps        # in a second terminal, from this folder
```

`npm run steps` does, 1.5 s apart:

1. delete `src/probe.js`
2. edit `style.css`
3. recreate `src/probe.js` (v2)
4. edit `src/probe.js` (v3)
5. edit `src/probe.js` (v4)

**Expected** at steps 4 and 5: `[vite] hot updated: /src/probe.js`.
**Actual**: `[vite] page reload src/probe.js` at both, and on every later edit of `src/probe.js`
until `style.css` is transformed again while the file exists.

Remove `cssDependsOnSources` from `vite.config.js` and step 4 is a normal HMR update.
