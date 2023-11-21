import { OPENAI_TOKEN } from '@/utils/env'
import OpenAI from 'openai'

export const openAi = new OpenAI({
  organization: 'org-ZR444RVRXOTctJDoUIJtw0vW',
  apiKey: OPENAI_TOKEN,
  dangerouslyAllowBrowser: true,
})
