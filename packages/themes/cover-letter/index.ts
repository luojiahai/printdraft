import type { Theme } from '@draft/types'
import { coverLetterSchema } from '@draft/types'
import Template from './Template.vue'

const coverLetter: Theme = {
  key: 'cover-letter',
  displayName: 'Cover Letter',
  documentType: 'cover-letter',
  schema: coverLetterSchema,
  styleVariables: [
    {
      key: 'fontFamily',
      label: 'Font',
      type: 'font',
      default: 'Georgia',
      options: ['Georgia', 'Times New Roman', 'Garamond', 'Palatino Linotype'],
    },
    {
      key: 'fontSize',
      label: 'Font Size',
      type: 'select',
      default: '11pt',
      options: ['10pt', '11pt', '12pt'],
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

export default coverLetter
