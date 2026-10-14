import { spawnSync } from 'node:child_process';
import process from 'node:process';
import { root, verifyIcons, reportError } from './verify-pwa-icons.mjs';

// Only generated dist is replaced. Verification is unreachable on any build failure.
const build = spawnSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--emptyOutDir'], {
  cwd: root, shell: false, timeout: 180000, maxBuffer: 1048576,
  encoding: 'utf8', windowsHide: true,
});
if (build.stdout) process.stdout.write(build.stdout);
if (build.stderr) process.stderr.write(build.stderr);
if (build.error || build.signal || build.status !== 0) {
  const reason = build.error?.code === 'ETIMEDOUT' ? 'build timeout' :
    build.error ? `build launch/I/O error: ${build.error.message}` :
    build.signal ? `build signal: ${build.signal}` : `build exit ${build.status}`;
  reportError(new Error(reason));
} else {
  await verifyIcons().catch(reportError);
}
