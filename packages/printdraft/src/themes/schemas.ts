import { z } from 'zod'

const heading1sub1Entry = z.object({
  type: z.literal('heading1+subheading1'),
  institution: z.string().optional(),
  organization: z.string().optional(),
  location: z.string().optional(),
  degree: z.string().optional(),
  title: z.string().optional(),
  date: z.string(),
  bullets: z.array(z.string()).optional(),
})

const heading1sub2Entry = z.object({
  type: z.literal('heading1+subheading2'),
  institution: z.string().optional(),
  organization: z.string().optional(),
  location: z.string().optional(),
  role: z.string().optional(),
  date: z.string(),
})

const heading2Entry = z.object({
  type: z.literal('heading2'),
  award: z.string(),
  date: z.string(),
  description: z.string().optional(),
})

const heading3Entry = z.object({
  type: z.literal('heading3'),
  award: z.string(),
  date: z.string(),
})

const skillsEntry = z.object({
  type: z.literal('skills'),
  categories: z.array(z.object({ name: z.string(), content: z.string() })),
})

const entry = z.discriminatedUnion('type', [
  heading1sub1Entry,
  heading1sub2Entry,
  heading2Entry,
  heading3Entry,
  skillsEntry,
])

export const resumeSchema = z.object({
  theme: z.string(),
  lang: z.enum(['en', 'cn']).default('en'),
  style: z.record(z.string()).optional(),
  name: z.string(),
  contact: z.object({
    phone: z.string().optional(),
    email: z.string().optional(),
    linkedin: z.string().optional(),
  }),
  sections: z.array(z.object({
    title: z.string(),
    entries: z.array(entry),
  })),
})

export const coverLetterSchema = z.object({
  theme: z.string(),
  lang: z.enum(['en', 'cn']).default('en'),
  style: z.record(z.string()).optional(),
  sender: z.object({
    name: z.string(),
    address: z.string(),
    email: z.string(),
    date: z.string(),
  }),
  recipient: z.object({
    name: z.string(),
    company: z.string(),
    address: z.string(),
  }),
  subject: z.string(),
  body: z.array(z.string()),
  closing: z.string(),
})

export type ResumeData = z.infer<typeof resumeSchema>
export type CoverLetterData = z.infer<typeof coverLetterSchema>
