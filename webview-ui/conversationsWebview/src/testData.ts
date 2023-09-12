import {
  IConversation,
  IPersonaOpenAI,
  IConfiguration,
  IPrompt,
} from './interfaces'

export function getTestConversation(): IConversation[] {
  const prompt: IPrompt = {
    system: 'test-system',
  }

  const configuration: IConfiguration = {
    model: 'test-model',
    service: 'test-service',
  }

  const personaOpenAI: IPersonaOpenAI = {
    roleId: 'test-id',
    roleName: 'test-role',
    configuration: configuration,
    prompt: prompt,
  }

  const conversation: IConversation = {
    timestamp: new Date().getTime(),
    conversationId: 'a1150641-28b6-49ee-bd1a-cc5aab18dd91',
    embeddingId: 'embeddingId',
    persona: personaOpenAI,
    summary: 'summary',
    chatMessages: [],
  }
  console.log(`conversation: ${conversation}`)
  return [conversation]
}
