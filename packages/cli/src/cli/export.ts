import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer'
import chalk from 'chalk'
import { parseDocument } from '@printdraft/parser'
import { startServer } from '../server/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function exportPdf(opts: { output: string }) {
  const docPath = path.join(process.cwd(), 'document.md')

  if (!fs.existsSync(docPath)) {
    console.error(chalk.red('  document.md not found. Run `draft init` first.'))
    process.exit(1)
  }

  // Validate document before launching browser
  let parsedDoc
  try {
    const content = fs.readFileSync(docPath, 'utf-8')
    parsedDoc = parseDocument(content)
  } catch (err) {
    console.error(chalk.red(`  Parse error: ${err}`))
    process.exit(1)
  }

  if ((parsedDoc.data as { lang?: string }).lang === 'cn') {
    console.warn(chalk.yellow(
      '  Warning: lang: cn detected. Headless Chrome may not have CJK fonts installed.\n' +
      '  On Linux, install them with: sudo apt-get install fonts-noto-cjk\n'
    ))
  }

  const distApp = path.join(__dirname, '..', '..', 'dist', 'app')

  if (!fs.existsSync(path.join(distApp, 'index.html'))) {
    console.error(chalk.red('  App not built. Run `draft dev` first to build the app.'))
    process.exit(1)
  }

  console.log(chalk.bold('\n  draft export\n'))
  console.log('  Launching Puppeteer…')

  const server = await startServer(docPath, distApp)
  const url = `http://localhost:${server.port}`

  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  await page.goto(url, { waitUntil: 'networkidle0' })

  // Wait for preview to render
  await page.waitForSelector('.resume-classic, .resume-modern, .resume-compact, .cover-letter', {
    timeout: 10000,
  })

  const outputPath = path.resolve(process.cwd(), opts.output)

  await page.pdf({
    path: outputPath,
    format: 'Letter',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  })

  await browser.close()
  await server.close()

  console.log(chalk.green(`  ✓ Saved ${outputPath}\n`))
}
