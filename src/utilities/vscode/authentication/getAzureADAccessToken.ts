import { authentication } from 'vscode'

export async function getAzureADAccessToken(): Promise<string> {
  const msSession = await authentication.getSession(
    'microsoft',
    ['https://management.core.windows.net/.default', 'offline_access'],
    { createIfNone: true }
  )
  return msSession.accessToken
}
