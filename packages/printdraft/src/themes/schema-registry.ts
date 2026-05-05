import type { ZodSchema } from 'zod'
import { resumeSchema, coverLetterSchema } from './schemas.js'

export interface ThemeMeta {
  key: string
  displayName: string
  documentType: 'resume' | 'cover-letter'
  schema: ZodSchema
}

export const schemaRegistry: Record<string, ThemeMeta> = {
  'resume-classic': { key: 'resume-classic', displayName: 'Classic', documentType: 'resume', schema: resumeSchema },
  'resume-modern': { key: 'resume-modern', displayName: 'Modern', documentType: 'resume', schema: resumeSchema },
  'resume-compact': { key: 'resume-compact', displayName: 'Compact', documentType: 'resume', schema: resumeSchema },
  'cover-letter': { key: 'cover-letter', displayName: 'Cover Letter', documentType: 'cover-letter', schema: coverLetterSchema },
}
