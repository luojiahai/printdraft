import { describe, it, expect } from 'vitest'
import { parseDocument } from './index.js'
import { resumeSchema, coverLetterSchema, schemaRegistry } from '@draftjs/types'

function makeResumeYaml(fields: Record<string, string> = {}): string {
  const theme = fields.theme ?? 'resume-classic'
  const name = fields.name ?? 'Jane Doe'
  return [
    '---',
    `theme: ${theme}`,
    `name: ${name}`,
    'contact:',
    '  email: jane@example.com',
    'sections: []',
    '---',
  ].join('\n')
}

function makeCoverLetterYaml(): string {
  return [
    '---',
    'theme: cover-letter',
    'sender:',
    '  name: Jane Doe',
    '  address: 123 Main St',
    '  email: jane@example.com',
    '  date: "2024-01-01"',
    'recipient:',
    '  name: Hiring Manager',
    '  company: Acme Corp',
    '  address: 456 Oak Ave',
    'subject: Application for Software Engineer',
    'body:',
    '  - First paragraph.',
    '  - Second paragraph.',
    'closing: Sincerely',
    '---',
  ].join('\n')
}

describe('parseDocument', () => {
  describe('error cases', () => {
    it('throws when no YAML frontmatter delimiters are present', () => {
      expect(() => parseDocument('just some plain text'))
        .toThrow('No YAML frontmatter found in document.md')
    })

    it('throws when opening --- is present but closing --- is absent', () => {
      expect(() => parseDocument('---\ntheme: resume-classic\n'))
        .toThrow('No YAML frontmatter found in document.md')
    })

    it('throws when theme field is missing from frontmatter', () => {
      expect(() => parseDocument('---\nname: Jane Doe\n---'))
        .toThrow('Missing "theme" field in frontmatter')
    })

    it('throws for unknown theme key with message listing available themes', () => {
      const content = '---\ntheme: nonexistent-theme\n---'
      expect(() => parseDocument(content))
        .toThrow(/Unknown theme "nonexistent-theme"\. Available themes:/)
    })

    it('includes all registered theme keys in the unknown-theme error', () => {
      const content = '---\ntheme: nonexistent-theme\n---'
      const available = Object.keys(schemaRegistry).join(', ')
      expect(() => parseDocument(content)).toThrow(available)
    })

    it('throws a Zod error when required name field is missing', () => {
      const content = [
        '---',
        'theme: resume-classic',
        'contact:',
        '  email: jane@example.com',
        'sections: []',
        '---',
      ].join('\n')
      expect(() => parseDocument(content)).toThrow()
      try {
        parseDocument(content)
      } catch (err) {
        expect((err as Error).message).toMatch(/name/i)
      }
    })
  })

  describe('valid resume document', () => {
    it('returns correct ThemeMeta for resume-classic', () => {
      const result = parseDocument(makeResumeYaml({ theme: 'resume-classic' }))
      expect(result.theme).toEqual(schemaRegistry['resume-classic'])
      expect(result.theme.key).toBe('resume-classic')
      expect(result.theme.documentType).toBe('resume')
      expect(result.theme.displayName).toBe('Classic')
    })

    it('returns correct ThemeMeta for resume-modern', () => {
      const result = parseDocument(makeResumeYaml({ theme: 'resume-modern' }))
      expect(result.theme.key).toBe('resume-modern')
      expect(result.theme.displayName).toBe('Modern')
    })

    it('returns correct ThemeMeta for resume-compact', () => {
      const result = parseDocument(makeResumeYaml({ theme: 'resume-compact' }))
      expect(result.theme.key).toBe('resume-compact')
      expect(result.theme.displayName).toBe('Compact')
    })

    it('defaults lang to "en" via Zod coercion', () => {
      const result = parseDocument(makeResumeYaml())
      expect((result.data as Record<string, unknown>).lang).toBe('en')
    })

    it('preserves rawContent as the original input string', () => {
      const content = makeResumeYaml()
      expect(parseDocument(content).rawContent).toBe(content)
    })
  })

  describe('valid cover letter document', () => {
    it('returns correct ThemeMeta for cover-letter', () => {
      const result = parseDocument(makeCoverLetterYaml())
      expect(result.theme).toEqual(schemaRegistry['cover-letter'])
      expect(result.theme.key).toBe('cover-letter')
      expect(result.theme.documentType).toBe('cover-letter')
      expect(result.theme.displayName).toBe('Cover Letter')
    })

    it('parses body as an array of strings', () => {
      const result = parseDocument(makeCoverLetterYaml())
      expect((result.data as Record<string, unknown>).body).toEqual([
        'First paragraph.',
        'Second paragraph.',
      ])
    })

    it('parses sender and recipient objects', () => {
      const result = parseDocument(makeCoverLetterYaml())
      const data = result.data as Record<string, Record<string, string>>
      expect(data.sender.name).toBe('Jane Doe')
      expect(data.recipient.company).toBe('Acme Corp')
    })
  })
})

describe('resumeSchema', () => {
  const base = {
    theme: 'resume-classic',
    name: 'Jane Doe',
    contact: { email: 'jane@example.com' },
    sections: [],
  }

  describe('lang field', () => {
    it('defaults to "en" when omitted', () => {
      expect(resumeSchema.parse(base).lang).toBe('en')
    })

    it('accepts "cn"', () => {
      expect(resumeSchema.parse({ ...base, lang: 'cn' }).lang).toBe('cn')
    })

    it('rejects invalid lang values', () => {
      expect(() => resumeSchema.parse({ ...base, lang: 'fr' })).toThrow()
    })
  })

  describe('style field', () => {
    it('is optional', () => {
      expect(resumeSchema.parse(base).style).toBeUndefined()
    })

    it('accepts a record of string values', () => {
      const result = resumeSchema.parse({ ...base, style: { fontSize: '12pt', color: '#000' } })
      expect(result.style).toEqual({ fontSize: '12pt', color: '#000' })
    })
  })

  describe('entry types', () => {
    function parseWithEntries(entries: unknown[]) {
      return resumeSchema.parse({ ...base, sections: [{ title: 'Section', entries }] })
    }

    it('parses heading1+subheading1 with institution, degree, and bullets', () => {
      const parsed = parseWithEntries([{
        type: 'heading1+subheading1',
        institution: 'MIT',
        degree: 'B.S. Computer Science',
        location: 'Cambridge, MA',
        date: '2020',
        bullets: ['GPA 3.9', "Dean's List"],
      }])
      const entry = parsed.sections[0].entries[0] as Record<string, unknown>
      expect(entry.type).toBe('heading1+subheading1')
      expect(entry.institution).toBe('MIT')
      expect(entry.degree).toBe('B.S. Computer Science')
      expect(entry.bullets).toEqual(['GPA 3.9', "Dean's List"])
    })

    it('parses heading1+subheading1 with organization and title, no bullets', () => {
      const parsed = parseWithEntries([{
        type: 'heading1+subheading1',
        organization: 'Google',
        title: 'Software Engineer',
        date: '2021–2023',
      }])
      const entry = parsed.sections[0].entries[0] as Record<string, unknown>
      expect(entry.organization).toBe('Google')
      expect(entry.title).toBe('Software Engineer')
      expect(entry.bullets).toBeUndefined()
    })

    it('parses heading1+subheading2', () => {
      const parsed = parseWithEntries([{
        type: 'heading1+subheading2',
        institution: 'Stanford',
        role: 'Teaching Assistant',
        date: '2022',
      }])
      const entry = parsed.sections[0].entries[0] as Record<string, unknown>
      expect(entry.type).toBe('heading1+subheading2')
      expect(entry.role).toBe('Teaching Assistant')
    })

    it('parses heading2 with description', () => {
      const parsed = parseWithEntries([{
        type: 'heading2',
        award: 'Best Paper Award',
        date: '2023',
        description: 'Awarded at ICML',
      }])
      const entry = parsed.sections[0].entries[0] as Record<string, unknown>
      expect(entry.award).toBe('Best Paper Award')
      expect(entry.description).toBe('Awarded at ICML')
    })

    it('parses heading2 without description', () => {
      const parsed = parseWithEntries([{ type: 'heading2', award: 'Scholarship', date: '2022' }])
      const entry = parsed.sections[0].entries[0] as Record<string, unknown>
      expect(entry.description).toBeUndefined()
    })

    it('parses heading3', () => {
      const parsed = parseWithEntries([{ type: 'heading3', award: 'Honor Roll', date: '2021' }])
      expect(parsed.sections[0].entries[0].type).toBe('heading3')
    })

    it('parses skills with multiple categories', () => {
      const parsed = parseWithEntries([{
        type: 'skills',
        categories: [
          { name: 'Languages', content: 'TypeScript, Python' },
          { name: 'Tools', content: 'Git, Docker' },
        ],
      }])
      const entry = parsed.sections[0].entries[0] as Record<string, unknown>
      const categories = entry.categories as Array<{ name: string; content: string }>
      expect(entry.type).toBe('skills')
      expect(categories).toHaveLength(2)
      expect(categories[0].name).toBe('Languages')
      expect(categories[1].content).toBe('Git, Docker')
    })

    it('rejects an unknown entry type', () => {
      expect(() => parseWithEntries([{ type: 'unknown-type', date: '2023' }])).toThrow()
    })
  })
})

describe('coverLetterSchema', () => {
  const base = {
    theme: 'cover-letter',
    sender: { name: 'Jane Doe', address: '123 Main St', email: 'jane@example.com', date: '2024-01-01' },
    recipient: { name: 'Hiring Manager', company: 'Acme Corp', address: '456 Oak Ave' },
    subject: 'Application',
    body: ['Opening paragraph.', 'Closing paragraph.'],
    closing: 'Sincerely',
  }

  it('parses a complete valid cover letter', () => {
    const result = coverLetterSchema.parse(base)
    expect(result.sender.name).toBe('Jane Doe')
    expect(result.recipient.company).toBe('Acme Corp')
    expect(result.subject).toBe('Application')
    expect(result.closing).toBe('Sincerely')
  })

  it('parses body as an array of strings', () => {
    expect(coverLetterSchema.parse(base).body).toEqual(['Opening paragraph.', 'Closing paragraph.'])
  })

  it('defaults lang to "en" when omitted', () => {
    expect(coverLetterSchema.parse(base).lang).toBe('en')
  })

  it('style is optional', () => {
    expect(coverLetterSchema.parse(base).style).toBeUndefined()
  })

  it('accepts lang "cn"', () => {
    expect(coverLetterSchema.parse({ ...base, lang: 'cn' }).lang).toBe('cn')
  })

  it('throws when sender.name is missing', () => {
    const invalid = { ...base, sender: { ...base.sender, name: undefined } }
    expect(() => coverLetterSchema.parse(invalid)).toThrow()
  })

  it('throws when body is not an array', () => {
    expect(() => coverLetterSchema.parse({ ...base, body: 'not an array' })).toThrow()
  })
})

describe('schemaRegistry', () => {
  it('contains exactly resume-classic, resume-modern, resume-compact, cover-letter', () => {
    expect(Object.keys(schemaRegistry).sort()).toEqual(
      ['cover-letter', 'resume-classic', 'resume-compact', 'resume-modern'],
    )
  })

  it('each entry has key, displayName, documentType, and schema.parse', () => {
    for (const [key, meta] of Object.entries(schemaRegistry)) {
      expect(meta.key).toBe(key)
      expect(typeof meta.displayName).toBe('string')
      expect(['resume', 'cover-letter']).toContain(meta.documentType)
      expect(typeof meta.schema.parse).toBe('function')
    }
  })

  it('cover-letter entry has documentType "cover-letter"', () => {
    expect(schemaRegistry['cover-letter'].documentType).toBe('cover-letter')
  })

  it('all resume-* entries have documentType "resume"', () => {
    for (const key of ['resume-classic', 'resume-modern', 'resume-compact']) {
      expect(schemaRegistry[key].documentType).toBe('resume')
    }
  })
})
