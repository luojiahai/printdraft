# printdraft

CLI for creating professional PDF resumes and cover letters. Documents are written as Vue components, previewed live in the browser, and exported to PDF.

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

Scaffold a new `document.vue` interactively. Choose document type, theme, and fill in your details.

### `draft dev`

Start a live preview at `http://localhost:3001`. Edit `document.vue` in your code editor — changes hot-reload instantly in the browser.

### `draft export`

Export `document.vue` to `document.pdf` via Puppeteer.

```bash
draft export
draft export --output my-resume.pdf
```

## Document Format

Documents are Vue SFCs. Import components from `@printdraft/components` and compose your document in the template.

### Resume

```vue
<script setup lang="ts">
import {
  Resume, Name, Contact, Phone, Email, LinkedIn,
  Section, Experience, Education, Activity, Award, Skills, Category
} from '@printdraft/components'
</script>

<template>
  <Resume theme="resume-classic" font-size="10pt">
    <Name>Last, First</Name>
    <Contact>
      <Phone>+1 (555) 000-0000</Phone>
      <Email>email@example.com</Email>
      <LinkedIn>username</LinkedIn>
    </Contact>

    <Section title="Education">
      <Education institution="University Name" location="City, State" degree="B.S. Computer Science" date="May 2024">
        <li>GPA: 3.9</li>
      </Education>
    </Section>

    <Section title="Experience">
      <Experience org="Company Name" location="City, State" title="Software Engineer" date="Jun 2023 – Present">
        <li>Action + Task → Outcome</li>
      </Experience>
    </Section>

    <Section title="Skills & Interests">
      <Skills>
        <Category name="Programming">Python, Go, TypeScript</Category>
      </Skills>
    </Section>
  </Resume>
</template>
```

### Cover Letter

```vue
<script setup lang="ts">
import {
  CoverLetter, Sender, Recipient, Subject, Body, Closing
} from '@printdraft/components'
</script>

<template>
  <CoverLetter font-size="11pt">
    <Sender name="John Smith" address="123 Main St, City, State" email="john@example.com" date="May 5, 2026" />
    <Recipient name="Hiring Manager" company="Company Name" address="456 Corp Ave, City, State" />
    <Subject>Application for Software Engineer Position</Subject>
    <Body>
      <p>Dear Hiring Manager,</p>
      <p>Opening paragraph.</p>
      <p>Body paragraph.</p>
      <p>Closing paragraph.</p>
    </Body>
    <Closing>
      <p>Sincerely,</p>
      <p>John Smith</p>
    </Closing>
  </CoverLetter>
</template>
```

## Components

### Resume

| Component | Props | Usage |
|---|---|---|
| `Resume` | `theme`, `font-size`, `font-family` | Root document wrapper |
| `Name` | — | Full name |
| `Contact` | — | Contact info container |
| `Phone` | — | Phone number |
| `Email` | — | Email address |
| `LinkedIn` | — | LinkedIn username |
| `Section` | `title` | Section with heading |
| `Experience` | `org`, `location`, `title`, `date` | Work experience entry |
| `Education` | `institution`, `location`, `degree`, `date` | Education entry |
| `Activity` | `org`, `location`, `role`, `date` | Activity/club entry (no bullets) |
| `Award` | `name`, `date`, `description` | Award entry |
| `Skills` | — | Skills container |
| `Category` | `name` | Skill category |

### Cover Letter

| Component | Props | Usage |
|---|---|---|
| `CoverLetter` | `font-size`, `font-family` | Root document wrapper |
| `Sender` | `name`, `address`, `email`, `date` | Sender block |
| `Recipient` | `name`, `company`, `address` | Recipient block |
| `Subject` | — | Subject line |
| `Body` | — | Letter body (use `<p>` tags) |
| `Closing` | — | Closing block |

## Themes

Set via the `theme` prop on `<Resume>`.

| Theme | Description |
|---|---|
| `resume-classic` | LaTeX-inspired, Times New Roman, traditional layout |
| `resume-modern` | Clean minimal with accent color bar |
| `resume-compact` | Dense single-column, ATS-friendly |

Cover letters use a fixed formal block-letter layout — no `theme` prop needed.

## License

MIT
