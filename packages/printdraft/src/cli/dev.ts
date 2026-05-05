import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'
import open from 'open'
import chalk from 'chalk'
import { startServer } from '../server/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function dev() {
  const docPath = path.join(process.cwd(), 'document.md')

  if (!fs.existsSync(docPath)) {
    console.error(chalk.red('  document.md not found. Run `printdraft init` first.'))
    process.exit(1)
  }

  // dist/app is two dirs up from dist/cli/
  const distApp = path.join(__dirname, '..', '..', 'dist', 'app')
  const hasBuiltApp = fs.existsSync(path.join(distApp, 'index.html'))

  if (hasBuiltApp) {
    // Production mode: serve built app via Express
    const { port } = await startServer(docPath, distApp)
    const url = `http://localhost:${port}`
    console.log(chalk.bold(`\n  printdraft dev\n`))
    console.log(`  ${chalk.green('➜')}  Editing at ${chalk.cyan(url)}\n`)
    await open(url)
  } else {
    // Dev mode: start Express API server + Vite dev server
    const apiServer = await startServer(docPath, distApp)
    console.log(chalk.bold(`\n  printdraft dev (development mode)\n`))
    console.log(chalk.yellow(`  Tip: run \`printdraft build\` to build the app for production mode.\n`))
    console.log(`  ${chalk.green('➜')}  API server on port ${apiServer.port}`)

    // Spawn Vite dev server from the package root
    const pkgRoot = path.join(__dirname, '..', '..')
    const vite = spawn('npx', ['vite', '--port', '3001'], {
      cwd: pkgRoot,
      stdio: 'inherit',
      shell: true,
    })

    const url = 'http://localhost:3001'
    console.log(`  ${chalk.green('➜')}  Editor at ${chalk.cyan(url)}\n`)

    setTimeout(() => open(url), 1500)

    process.on('SIGINT', () => { vite.kill(); process.exit(0) })
    process.on('SIGTERM', () => { vite.kill(); process.exit(0) })

    await new Promise<void>((resolve) => vite.on('close', resolve))
    await apiServer.close()
  }
}
