import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer'
import chalk from 'chalk'
import { startViteServer } from './vite-server.js'

export async function exportPdf(opts: { output: string }) {
  const docPath = path.resolve(process.cwd(), 'document.vue')

  if (!fs.existsSync(docPath)) {
    console.error(chalk.red('  document.vue not found. Run `draft init` first.'))
    process.exit(1)
  }

  console.log(chalk.bold('\n  draft export\n'))
  console.log('  Starting preview server…')

  const server = await startViteServer(docPath, 0)
  await server.listen()

  try {
    const address = server.httpServer?.address()
    const port = typeof address === 'object' && address ? address.port : 3001
    const url = `http://localhost:${port}`

    console.log('  Launching Puppeteer…')

    const browser = await puppeteer.launch({ headless: true })
    try {
      const page = await browser.newPage()

      await page.goto(url, { waitUntil: 'networkidle0' })
      await page.waitForSelector('.pd-document', { timeout: 15000 })

      const outputPath = path.resolve(process.cwd(), opts.output)

      await page.pdf({
        path: outputPath,
        format: 'Letter',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      })

      console.log(chalk.green(`  ✓ Saved ${outputPath}\n`))
    } finally {
      await browser.close()
    }
  } finally {
    await server.close()
  }
}
