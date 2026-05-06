import { Command } from 'commander'
import { init } from './init.js'
import { dev } from './dev.js'
import { exportPdf } from './export.js'

const program = new Command()

program
  .name('draft')
  .description('Create professional PDF resumes and cover letters')
  .version('0.1.0')

program
  .command('init')
  .description('Scaffold a new document')
  .action(init)

program
  .command('dev')
  .description('Start the live-preview server')
  .action(dev)

program
  .command('export')
  .description('Export document.vue to PDF')
  .option('-o, --output <path>', 'Output PDF path', './document.pdf')
  .action(exportPdf)

program.parse()
