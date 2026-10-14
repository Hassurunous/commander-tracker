import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import process from 'node:process';

export const root = fileURLToPath(new URL('../', import.meta.url));
const icons = [
  { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
  { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
];
async function requiredFile(path) {
  try { return await readFile(path); }
  catch (error) {
    if (error.code === 'ENOENT') assert.fail(`Missing required file: ${path}`);
    throw error;
  }
}
export async function verifyIcons(output = resolve(root, 'dist')) {
  let manifest;
  const bytes = await requiredFile(resolve(output, 'manifest.webmanifest'));
  try { manifest = JSON.parse(bytes.toString('utf8')); }
  catch (error) {
    if (error instanceof SyntaxError) assert.fail('Invalid manifest JSON');
    throw error;
  }
  assert.deepEqual(manifest?.icons, icons, 'Manifest icon entries must remain unchanged');
  for (const icon of icons) {
    const name = icon.src.slice(1);
    const original = await requiredFile(resolve(root, 'src/assets', name));
    const published = await requiredFile(resolve(root, 'public', name));
    const deployed = await requiredFile(resolve(output, name));
    assert.deepEqual(published, original, `${name}: public bytes differ from original`);
    assert.deepEqual(deployed, original, `${name}: deployed bytes differ from original`);
    process.stdout.write(`PASS ${icon.src}: manifest and original/public/deployed bytes\n`);
  }
}
export function reportError(error) {
  const assertion = error instanceof assert.AssertionError;
  process.stderr.write(`${assertion ? 'ASSERTION' : 'OPERATIONAL'}: ${error.message}\n`);
  process.exitCode = assertion ? 1 : 2;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv.length > 3) {
    reportError(new Error('Usage: node scripts/verify-pwa-icons.mjs [output-directory]'));
  } else {
    verifyIcons(process.argv[2] ? resolve(process.argv[2]) : undefined).catch(reportError);
  }
}
