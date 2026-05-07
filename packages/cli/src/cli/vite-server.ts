import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import { createServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import type { ViteDevServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

export async function startViteServer(docPath: string, port = 3001): Promise<ViteDevServer> {
  const docDir = path.dirname(docPath)
  // dist/cli/ → package root → src/app/
  const cliRoot = path.resolve(__dirname, '..', '..')
  const appRoot = path.resolve(cliRoot, 'src', 'app')

  const componentsPkgJsonPath = require.resolve('@printdraft/components/package.json')
  const componentsDir = path.dirname(componentsPkgJsonPath)
  const componentsEntry = path.join(componentsDir, 'src', 'index.ts')

  const server = await createServer({
    root: appRoot,
    plugins: [
      vue(),
      {
        name: 'printdraft-user-document',
        resolveId(id: string) {
          if (id === 'virtual:user-document') return '\0virtual:user-document'
        },
        load(id: string) {
          if (id === '\0virtual:user-document') {
            return `export { default } from '${docPath.replace(/\\/g, '/')}'`
          }
        },
      },
    ],
    resolve: {
      alias: { '@printdraft/components': componentsEntry },
    },
    server: {
      port,
      strictPort: false,
      fs: { allow: [docDir, cliRoot, componentsDir] },
    },
    logLevel: 'warn',
  })

  return server
}
