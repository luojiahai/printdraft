import type { DefineComponent } from 'vue'
import type { ZodSchema } from 'zod'

export interface StyleVariable {
  key: string
  label: string
  type: 'color' | 'font' | 'select'
  default: string
  options?: string[]
}

export interface Theme {
  key: string
  displayName: string
  documentType: 'resume' | 'cover-letter'
  schema: ZodSchema
  styleVariables: StyleVariable[]
  component: DefineComponent<any, any, any>
}

import resumeClassic from './resume-classic/index.js'
import resumeModern from './resume-modern/index.js'
import resumeCompact from './resume-compact/index.js'
import coverLetter from './cover-letter/index.js'

export const themes: Record<string, Theme> = {
  'resume-classic': resumeClassic,
  'resume-modern': resumeModern,
  'resume-compact': resumeCompact,
  'cover-letter': coverLetter,
}
