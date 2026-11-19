// Runs the file operations from the README, one step every 1.5 s.
// Keep the page open with the console visible while this runs.
import { readFileSync, rmSync, writeFileSync } from 'node:fs';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const probe = (v) =>
  `document.getElementById('probe').textContent = 'probe ${v}';\nimport.meta.hot?.accept();\n`;
const steps = [
  ['delete src/probe.js', () => rmSync('src/probe.js')],
  ['edit style.css (the stylesheet is transformed again while probe.js is missing)', () =>
    writeFileSync('style.css', readFileSync('style.css', 'utf8') + `/* ${Date.now()} */\n`)],
  ['recreate src/probe.js (v2)', () => writeFileSync('src/probe.js', probe('v2'))],
  ['edit src/probe.js (v3)  <- expected: hmr update, actual: page reload', () => writeFileSync('src/probe.js', probe('v3'))],
  ['edit src/probe.js (v4)  <- page reload again', () => writeFileSync('src/probe.js', probe('v4'))],
];
for (const [name, run] of steps) {
  console.log(name);
  run();
  await sleep(1500);
}
// Restore the starting state.
writeFileSync('style.css', 'body { font-family: sans-serif; }\n');
writeFileSync('src/probe.js', probe('v1'));
