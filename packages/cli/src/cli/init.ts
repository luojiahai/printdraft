import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import { select, input, confirm } from '@inquirer/prompts'
import chalk from 'chalk'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function init() {
  console.log(chalk.bold('\n  draft init\n'))

  const docType = await select({
    message: 'Document type:',
    choices: [
      { name: 'Resume', value: 'resume' },
      { name: 'Cover Letter', value: 'cover-letter' },
    ],
  })

  const themeChoices =
    docType === 'resume'
      ? [
          { name: 'Classic  — LaTeX-inspired, traditional', value: 'resume-classic' },
          { name: 'Modern   — Clean minimal with accent color', value: 'resume-modern' },
          { name: 'Compact  — Dense, ATS-friendly', value: 'resume-compact' },
        ]
      : [{ name: 'Cover Letter — Formal block-letter layout', value: 'cover-letter' }]

  const theme = await select({ message: 'Theme:', choices: themeChoices })

  const name = await input({ message: 'Your name:' })
  const email = await input({ message: 'Email:' })
  const phone = await input({ message: 'Phone:' })
  const linkedin = docType === 'resume'
    ? await input({ message: 'LinkedIn username (optional):' })
    : ''

  const templateFile =
    docType === 'resume' ? 'resume-empty.vue' : 'cover-letter-empty.vue'
  const templatePath = path.join(__dirname, '..', '..', 'templates', templateFile)
  let template = fs.readFileSync(templatePath, 'utf-8')

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  template = template
    .replace(/\[NAME\]/g, name || 'Your Name')
    .replace(/\[EMAIL\]/g, email || 'email@example.com')
    .replace(/\[PHONE\]/g, phone || '+1 (555) 000-0000')
    .replace(/\[LINKEDIN\]/g, linkedin || 'username')
    .replace(/\[THEME\]/g, theme)
    .replace(/\[DATE\]/g, today)

  const docPath = path.join(process.cwd(), 'document.vue')
  if (fs.existsSync(docPath)) {
    const overwrite = await confirm({
      message: 'document.vue already exists. Overwrite?',
      default: false,
    })
    if (!overwrite) { console.log(chalk.yellow('Aborted.')); return }
  }

  fs.writeFileSync(docPath, template, 'utf-8')
  console.log(chalk.green('  ✓ Created document.vue'))

  const gitignorePath = path.join(process.cwd(), '.gitignore')
  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, 'node_modules/\n*.pdf\n.DS_Store\n', 'utf-8')
    console.log(chalk.green('  ✓ Created .gitignore'))
  }

  const gitDir = path.join(process.cwd(), '.git')
  if (!fs.existsSync(gitDir)) {
    const doGit = await confirm({ message: 'Initialize a git repository?', default: true })
    if (doGit) {
      execSync('git init && git add . && git commit -m "init"', { stdio: 'inherit' })
    }
  }

  console.log(chalk.bold('\n  Done! Open document.vue in your editor, then run:\n'))
  console.log('    ' + chalk.cyan('draft dev') + '\n')
}
