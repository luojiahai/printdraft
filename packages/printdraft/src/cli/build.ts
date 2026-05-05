import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import chalk from 'chalk'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function build() {
  const pkgRoot = path.join(__dirname, '..', '..')
  console.log(chalk.bold('\n  printdraft build\n'))
  execSync('pnpm build:app', { cwd: pkgRoot, stdio: 'inherit' })
  console.log(chalk.green('\n  ✓ App built successfully\n'))
}
