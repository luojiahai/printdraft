import type { Theme } from '@draftjs/types'
import { resumeSchema } from '@draftjs/types'
import Template from './Template.vue'

const resumeClassic: Theme = {
  key: 'resume-classic',
  displayName: 'Classic',
  documentType: 'resume',
  schema: resumeSchema,
  styleVariables: [
    {
      key: 'fontFamily',
      label: 'Font',
      type: 'font',
      default: 'Times New Roman',
      options: ['Times New Roman', 'Georgia', 'Garamond', 'Palatino Linotype'],
    },
    {
      key: 'fontSize',
      label: 'Font Size',
      type: 'select',
      default: '10pt',
      options: ['9pt', '10pt', '11pt', '12pt'],
    },
    {
      key: 'primaryColor',
      label: 'Color',
      type: 'color',
      default: '#000000',
    },
  ],
  component: Template as any,
}

export default resumeClassic
