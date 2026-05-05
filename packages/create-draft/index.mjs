#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync, spawn } from 'node:child_process'
import prompts from 'prompts'
import ansis from 'ansis'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const renameFiles = { _gitignore: '.gitignore' }

function emptyDir(dir) {
  for (const file of fs.readdirSync(dir)) {
    fs.rmSync(path.join(dir, file), { recursive: true, force: true })
  }
}

function detectPackageManager() {
  const agent = process.env.npm_config_user_agent
  if (!agent) return undefined
  if (agent.startsWith('pnpm')) return 'pnpm'
  if (agent.startsWith('yarn')) return 'yarn'
  if (agent.startsWith('bun')) return 'bun'
  return 'npm'
}

async function main() {
  console.log(ansis.bold('\n  create-draft\n'))

  let targetDir = process.argv[2]

  if (!targetDir) {
    const { name } = await prompts({
      type: 'text',
      name: 'name',
      message: 'Project name:',
      initial: 'my-document',
    })
    targetDir = name?.trim() || 'my-document'
  }

  const packageName = targetDir.toLowerCase().replace(/[^a-z0-9-]/g, '-')

  const { docType } = await prompts({
    type: 'select',
    name: 'docType',
    message: 'Document type:',
    choices: [
      { title: 'Resume', value: 'resume' },
      { title: 'Cover letter', value: 'cover-letter' },
    ],
  })

  if (!docType) process.exit(1)

  const targetPath = path.resolve(process.cwd(), targetDir)

  if (fs.existsSync(targetPath) && fs.readdirSync(targetPath).length > 0) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `${targetDir} is not empty. Remove existing files and continue?`,
      initial: false,
    })
    if (!overwrite) {
      console.log(ansis.red('\n  ✗ Cancelled\n'))
      process.exit(1)
    }
    emptyDir(targetPath)
  }

  fs.mkdirSync(targetPath, { recursive: true })

  const templateDir = path.join(__dirname, 'template')

  // Copy template files (skip document starters — handled separately below)
  for (const file of fs.readdirSync(templateDir)) {
    if (file === 'resume.md' || file === 'cover-letter.md') continue
    fs.copyFileSync(
      path.join(templateDir, file),
      path.join(targetPath, renameFiles[file] ?? file),
    )
  }

  // Copy chosen document template as document.md
  fs.copyFileSync(
    path.join(templateDir, `${docType}.md`),
    path.join(targetPath, 'document.md'),
  )

  // Patch package.json name
  const pkgPath = path.join(targetPath, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  pkg.name = packageName
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

  const pm = detectPackageManager()

  const { shouldInstall } = await prompts({
    type: 'confirm',
    name: 'shouldInstall',
    message: 'Install and start it now?',
    initial: true,
  })

  if (shouldInstall) {
    const installPm = pm ?? 'npm'
    console.log(ansis.bold(`\n  Installing with ${installPm}...\n`))
    execFileSync(installPm, ['install'], { cwd: targetPath, stdio: 'inherit' })
    console.log(ansis.bold('\n  Starting dev server...\n'))
    spawn(installPm, ['run', 'dev'], { cwd: targetPath, stdio: 'inherit' })
  } else {
    const installCmd = pm ? `${pm} install` : 'npm install'
    const devCmd = pm ? `${pm} run dev` : 'npm run dev'
    console.log(ansis.bold('\n  Done! Now run:\n'))
    console.log(`    ${ansis.cyan(`cd ${targetDir}`)}`)
    console.log(`    ${ansis.cyan(installCmd)}`)
    console.log(`    ${ansis.cyan(devCmd)}\n`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
