import { getGitAccessToken } from '@app/apis/vscode'
import { HttpRequest, createErrorNotification } from '@app/apis/node'

export async function getApiKey(): Promise<string | undefined> {
  try {
    const accessToken = await getGitAccessToken()
    const request = new HttpRequest(
      'GET',
      `Bearer ${accessToken}`,
      'https://api.arbs.io/openai/oauth2/token'
    )
    const resp = await request.send()
    return resp.token as string
  } catch (error) {
    createErrorNotification(error)
    return undefined
  }
}
