import type { Theme } from '@draftjs/types'
import { resumeSchema } from '@draftjs/types'
import Template from './Template.vue'

const resumeCompact: Theme = {
  key: 'resume-compact',
  displayName: 'Compact',
  documentType: 'resume',
  schema: resumeSchema,
  styleVariables: [
    {
      key: 'fontFamily',
      label: 'Font',
      type: 'font',
      default: 'Arial',
      options: ['Arial', 'Helvetica Neue', 'Calibri', 'system-ui'],
    },
    {
      key: 'fontSize',
      label: 'Font Size',
      type: 'select',
      default: '10pt',
      options: ['9pt', '10pt', '11pt'],
    },
    {
      key: 'lineHeight',
      label: 'Line Height',
      type: 'select',
      default: '1.2',
      options: ['1.1', '1.2', '1.3', '1.4'],
    },
  ],
  component: Template as any,
}

export default resumeCompact
