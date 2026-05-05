#!/usr/bin/env node
try {
  require('child_process').execSync('draft init', { stdio: 'inherit' });
} catch {
  require('child_process').execSync('npx @printdraft/cli@latest init', { stdio: 'inherit' });
}
