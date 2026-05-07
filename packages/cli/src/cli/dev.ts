import fs from 'fs'
import path from 'path'
import open from 'open'
import chalk from 'chalk'
import { startViteServer } from './vite-server.js'

export async function dev() {
  const docPath = path.resolve(process.cwd(), 'document.vue')

  if (!fs.existsSync(docPath)) {
    console.error(chalk.red('  document.vue not found. Run `draft init` first.'))
    process.exit(1)
  }

  const server = await startViteServer(docPath, 3001)
  await server.listen()

  const address = server.httpServer?.address()
  const port = typeof address === 'object' && address ? address.port : 3001
  const url = `http://localhost:${port}`

  console.log(chalk.bold(`\n  draft dev\n`))
  console.log(`  ${chalk.green('➜')}  Preview at ${chalk.cyan(url)}\n`)
  console.log(`  Edit ${chalk.cyan('document.vue')} in your editor — changes hot-reload instantly.\n`)

  await open(url)

  const shutdown = async () => {
    await server.close()
    process.exit(0)
  }
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  await new Promise<void>(() => { /* keep alive */ })
}
