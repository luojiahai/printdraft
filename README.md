# printdraft

CLI and library for creating professional PDF resumes and cover letters.

## Quick Start

```bash
pnpm create draft
draft dev
draft export
```

## Installation

```bash
pnpm add -g @printdraft/cli
```

## Commands

### `draft init`

Scaffold a new document interactively. Choose document type, theme, language, and fill in your details.

### `draft dev`

Start the web editor at `http://localhost:3000`.

- **Left panel**: CodeMirror YAML editor — edit your document content
- **Right panel**: Live preview with your chosen theme
- **Style panel** (✦ button): Switch themes and adjust style variables

### `draft export`

Export `document.md` to `document.pdf` via Puppeteer.

```bash
draft export
draft export --output my-resume.pdf
```

## Document Format

All documents use `document.md` with YAML frontmatter only.

### Resume

```yaml
---
theme: resume-classic
lang: en
style:
  fontFamily: Times New Roman
  fontSize: 10pt
  primaryColor: '#000000'
name: 'Last, First'
contact:
  phone: '+1 (555) 000-0000'
  email: email@example.com
  linkedin: username
sections:
  - title: Education
    entries:
      - type: heading1+subheading1
        institution: University Name
        location: 'City, State'
        degree: B.S. Computer Science
        date: May 2024
        bullets:
          - 'GPA: 3.9'
  - title: Experience
    entries:
      - type: heading1+subheading1
        organization: Company Name
        location: 'City, State'
        title: Software Engineer
        date: Jun 2023 – Present
        bullets:
          - Action + Task → Outcome
  - title: Skills & Interests
    entries:
      - type: skills
        categories:
          - name: Programming
            content: 'Python, Go, TypeScript'
---
```

### Cover Letter

```yaml
---
theme: cover-letter
lang: en
style:
  fontFamily: Georgia
  fontSize: 11pt
sender:
  name: John Smith
  address: '123 Main St, City, State'
  email: john@example.com
  date: May 5, 2026
recipient:
  name: Hiring Manager
  company: Company Name
  address: '456 Corp Ave, City, State'
subject: Application for Software Engineer Position
body:
  - Opening paragraph.
  - Body paragraph.
  - Closing paragraph.
closing: Sincerely
---
```

## Entry Types (Resume)

| Type | Usage |
|---|---|
| `heading1+subheading1` | Education, Experience |
| `heading1+subheading2` | Activities (no bullets) |
| `heading2` | Awards with description |
| `heading3` | Simple awards |
| `skills` | Skill categories |

## Themes

| Theme | Description |
|---|---|
| `resume-classic` | LaTeX-inspired, Times New Roman, traditional layout |
| `resume-modern` | Clean minimal with accent color bar |
| `resume-compact` | Dense single-column, ATS-friendly |
| `cover-letter` | Formal block-letter layout |

## Languages

Set `lang: en` or `lang: cn` in your frontmatter. Chinese (`cn`) activates a CJK-compatible font stack.

## License

MIT
