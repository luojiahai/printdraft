import jsYaml from 'js-yaml'
import { schemaRegistry, type ThemeMeta } from '@draftjs/types'

export interface ParsedDocument {
  theme: ThemeMeta
  data: Record<string, unknown>
  rawContent: string
}

export function parseDocument(content: string): ParsedDocument {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) throw new Error('No YAML frontmatter found in document.md')

  const raw = jsYaml.load(match[1]) as Record<string, unknown>
  const themeKey = raw.theme as string

  if (!themeKey) throw new Error('Missing "theme" field in frontmatter')

  const theme = schemaRegistry[themeKey]
  if (!theme) {
    const available = Object.keys(schemaRegistry).join(', ')
    throw new Error(`Unknown theme "${themeKey}". Available themes: ${available}`)
  }

  const data = theme.schema.parse(raw) as Record<string, unknown>
  return { theme, data, rawContent: content }
}
