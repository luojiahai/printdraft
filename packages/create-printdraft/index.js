#!/usr/bin/env node
try {
  require('child_process').execSync('printdraft init', { stdio: 'inherit' });
} catch {
  require('child_process').execSync('npx printdraft@latest init', { stdio: 'inherit' });
}
