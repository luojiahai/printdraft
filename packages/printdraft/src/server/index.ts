import http from 'http'
import path from 'path'
import fs from 'fs'
import express from 'express'
import { WebSocketServer } from 'ws'
import chokidar from 'chokidar'
import getPort from 'get-port'

export interface ServerHandle {
  port: number
  close: () => Promise<void>
}

export async function startServer(docPath: string, distPath: string): Promise<ServerHandle> {
  const app = express()
  app.use(express.json())

  // Serve built Vue app
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath))
  }

  // GET /api/document — return raw YAML content
  app.get('/api/document', (_req, res) => {
    try {
      const content = fs.readFileSync(docPath, 'utf-8')
      res.json({ content })
    } catch {
      res.status(404).json({ error: 'document.md not found' })
    }
  })

  // POST /api/document — write new YAML content
  app.post('/api/document', (req, res) => {
    try {
      const { content } = req.body as { content: string }
      fs.writeFileSync(docPath, content, 'utf-8')
      res.json({ ok: true })
    } catch (err) {
      res.status(500).json({ error: String(err) })
    }
  })

  // SPA fallback
  app.get('*', (_req, res) => {
    const indexPath = path.join(distPath, 'index.html')
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath)
    } else {
      res.status(404).send('App not built. Run printdraft build first.')
    }
  })

  const port = await getPort({ port: 3000 })
  const server = http.createServer(app)

  // WebSocket server on the same http.Server
  const wss = new WebSocketServer({ server, path: '/ws' })

  // Watch document.md and broadcast reload to all connected clients
  const watcher = chokidar.watch(docPath, { ignoreInitial: true })
  watcher.on('change', () => {
    for (const client of wss.clients) {
      if (client.readyState === 1 /* OPEN */) {
        client.send(JSON.stringify({ type: 'reload' }))
      }
    }
  })

  await new Promise<void>((resolve) => server.listen(port, resolve))

  const close = (): Promise<void> =>
    new Promise((resolve, reject) => {
      watcher.close()
      wss.close()
      server.close((err) => (err ? reject(err) : resolve()))
    })

  return { port, close }
}
