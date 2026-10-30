const { spawnSync } = require('node:child_process');
const commands = [
  ['node', ['scripts/build.cjs']],
  ['node', ['--test', 'tests/unit/*.test.cjs']],
  ['node', ['node_modules/@playwright/test/cli.js', 'test']],
];
for (const [command, args] of commands) {
  const result = spawnSync(command, args, { stdio: 'inherit', cwd: require('node:path').resolve(__dirname, '..') });
  if (result.error) { console.error(result.error); process.exit(1); }
  if (result.status !== 0) process.exit(result.status || 1);
}
