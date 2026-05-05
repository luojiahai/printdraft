import type { Theme } from '@draft/types'
import { resumeSchema } from '@draft/types'
import Template from './Template.vue'

const resumeModern: Theme = {
  key: 'resume-modern',
  displayName: 'Modern',
  documentType: 'resume',
  schema: resumeSchema,
  styleVariables: [
    {
      key: 'fontFamily',
      label: 'Font',
      type: 'font',
      default: 'Inter',
      options: ['Inter', 'Roboto', 'Open Sans', 'system-ui'],
    },
    {
      key: 'fontSize',
      label: 'Font Size',
      type: 'select',
      default: '10pt',
      options: ['9pt', '10pt', '11pt'],
    },
    {
      key: 'accentColor',
      label: 'Accent Color',
      type: 'color',
      default: '#2563eb',
    },
  ],
  component: Template as any,
}

export default resumeModern
