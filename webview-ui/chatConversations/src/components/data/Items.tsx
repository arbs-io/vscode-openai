type SummaryCell = {
  label: string
}

type PersonaCell = {
  role: string
  model: string
  service: string
}

export type Item = {
  itemId: string
  persona: PersonaCell
  summary: SummaryCell
}

export const Items: Item[] = [
  {
    itemId: 'ff6d9755-9918-4723-950f-f8dec210fb45',
    persona: {
      role: 'Software Engineer',
      service: 'OpenAI',
      model: 'gpt-3.5-turbo',
    },
    summary: {
      label: 'Conversation about software engineering design patterns',
    },
  },
  {
    itemId: '073da89c-4f4d-46db-8db3-c04e9e24d273',
    persona: {
      role: 'Prompt Engineer',
      service: 'OpenAI',
      model: 'gpt-3.5-turbo',
    },
    summary: {
      label:
        'Conversation about prompts to fine tune a gpt model for custom chatbot experience',
    },
  },
  {
    itemId: 'cbb6e55c-b639-46d0-9758-8d7e2382bd10',
    persona: {
      role: 'Enterprise Architect',
      service: 'OpenAI',
      model: 'gpt-3.5-turbo',
    },
    summary: {
      label: 'Conversation about cloud architecture for low latency messaging',
    },
  },
  {
    itemId: '33cc8ce6-1e64-49e7-884e-19bc3542b11b',
    persona: {
      role: 'Data Engineer',
      service: 'OpenAI',
      model: 'gpt-3.5-turbo',
    },
    summary: {
      label: 'Conversation about Data Mesh design and implementation',
    },
  },
  {
    itemId: 'cbb6e55c-b639-46d0-9758-8d7e2382bd10',
    persona: {
      role: 'Enterprise Architect',
      service: 'OpenAI',
      model: 'gpt-3.5-turbo',
    },
    summary: {
      label: 'Conversation about technical solutions governance',
    },
  },
]
