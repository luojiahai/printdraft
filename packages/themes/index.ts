import type { Theme } from '@printdraft/types'
import resumeClassic from './resume-classic/index.js'
import resumeModern from './resume-modern/index.js'
import resumeCompact from './resume-compact/index.js'
import coverLetter from './cover-letter/index.js'

export { resumeClassic, resumeModern, resumeCompact, coverLetter }

export const themes: Record<string, Theme> = {
  'resume-classic': resumeClassic,
  'resume-modern': resumeModern,
  'resume-compact': resumeCompact,
  'cover-letter': coverLetter,
}
