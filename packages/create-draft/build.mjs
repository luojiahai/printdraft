import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const cliTemplates = path.join(__dirname, '..', 'cli', 'templates')
const dest = path.join(__dirname, 'template')

fs.mkdirSync(dest, { recursive: true })

fs.copyFileSync(
  path.join(cliTemplates, 'resume-empty.vue'),
  path.join(dest, 'resume.vue'),
)

fs.copyFileSync(
  path.join(cliTemplates, 'cover-letter-empty.vue'),
  path.join(dest, 'cover-letter.vue'),
)

console.log('✓ Template files copied to create-draft/template/')
