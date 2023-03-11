type PromptCell = {
  label: string
}

type PersonaCell = {
  role: string
  model: string
  service: string
}

export type PersonaOpenAI = {
  itemId: string
  persona: PersonaCell
  prompt: PromptCell
}
