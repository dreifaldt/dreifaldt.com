import { OPENAI_TOKEN } from '@/utils/env'
import OpenAI from 'openai'

export const openAi = new OpenAI({
  apiKey: OPENAI_TOKEN,
  dangerouslyAllowBrowser: true,
  organization: 'org-ZR444RVRXOTctJDoUIJtw0vW',
})
