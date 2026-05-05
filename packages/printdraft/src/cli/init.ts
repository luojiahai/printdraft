import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import { select, input, confirm } from '@inquirer/prompts'
import chalk from 'chalk'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function init() {
  console.log(chalk.bold('\n  printdraft init\n'))

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

  const lang = await select({
    message: 'Language:',
    choices: [
      { name: 'English', value: 'en' },
      { name: 'Chinese (中文)', value: 'cn' },
    ],
  })

  const name = await input({ message: 'Your name:' })
  const email = await input({ message: 'Email:' })
  const phone = await input({ message: 'Phone:' })
  const linkedin = await input({ message: 'LinkedIn username (optional):' })

  // Load template file
  const templateFile =
    docType === 'resume' ? 'resume-empty.md' : 'cover-letter-empty.md'

  // Templates are relative to the package root (two dirs up from dist/cli/)
  const templatePath = path.join(__dirname, '..', '..', 'templates', templateFile)
  let template = fs.readFileSync(templatePath, 'utf-8')

  // Fill in placeholders
  template = template
    .replace(/\[NAME\]/g, name)
    .replace(/\[EMAIL\]/g, email)
    .replace(/\[PHONE\]/g, phone)
    .replace(/\[LINKEDIN\]/g, linkedin || 'username')
    .replace(/^theme: .+$/m, `theme: ${theme}`)
    .replace(/^lang: .+$/m, `lang: ${lang}`)

  const docPath = path.join(process.cwd(), 'document.md')
  if (fs.existsSync(docPath)) {
    const overwrite = await confirm({
      message: 'document.md already exists. Overwrite?',
      default: false,
    })
    if (!overwrite) { console.log(chalk.yellow('Aborted.')); return }
  }

  fs.writeFileSync(docPath, template, 'utf-8')
  console.log(chalk.green('  ✓ Created document.md'))

  // .gitignore
  const gitignorePath = path.join(process.cwd(), '.gitignore')
  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, 'node_modules/\n*.pdf\n.DS_Store\n', 'utf-8')
    console.log(chalk.green('  ✓ Created .gitignore'))
  }

  // Optional git init
  const gitDir = path.join(process.cwd(), '.git')
  if (!fs.existsSync(gitDir)) {
    const doGit = await confirm({ message: 'Initialize a git repository?', default: true })
    if (doGit) {
      execSync('git init && git add . && git commit -m "init"', { stdio: 'inherit' })
    }
  }

  console.log(chalk.bold('\n  Done! Next step:\n'))
  console.log('    ' + chalk.cyan('printdraft dev') + '\n')
}
