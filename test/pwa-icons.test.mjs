import assert from 'node:assert/strict';
import { readFile, realpath, stat } from 'node:fs/promises';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));

function assertWithinDist(root, path) {
  const local = relative(root, path);
  assert.ok(local && local !== '..' && !local.startsWith(`..${sep}`) && !isAbsolute(local),
    `Icon must stay within dist: ${path}`);
}

test('built manifest declares local icon files present in dist', async () => {
  const manifest = JSON.parse(await readFile(resolve(dist, 'manifest.webmanifest'), 'utf8'));
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0,
    'This PWA must declare at least one icon');
  const canonicalDist = await realpath(dist);
  for (const icon of manifest.icons) {
    assert.ok(typeof icon?.src === 'string' && icon.src.trim(), 'Each icon needs a src');
    const src = decodeURIComponent(icon.src.split(/[?#]/, 1)[0]);
    assert.ok(src && !src.includes('\\') && !src.includes(':') && !src.startsWith('//'),
      `Expected a local icon path: ${icon.src}`);
    const path = resolve(dist, src.startsWith('/') ? src.slice(1) : src);
    assertWithinDist(dist, path);
    assertWithinDist(canonicalDist, await realpath(path));
    assert.ok((await stat(path)).isFile(), `Icon is not a file: ${icon.src}`);
  }
});
