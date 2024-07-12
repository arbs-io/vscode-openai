import { authentication } from 'vscode'

export async function getAzureOpenAIAccessToken(): Promise<string> {
  const msSession = await authentication.getSession(
    'microsoft',
    ['https://cognitiveservices.azure.com/.default', 'offline_access'],
    { createIfNone: true }
  )
  return msSession.accessToken
}
