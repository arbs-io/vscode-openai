import { Configuration, OpenAIApi } from 'openai'
import { commands, workspace } from 'vscode'
import SecretStorageService from '../services/secretStorageService'

export async function validateApiKey() {
  const apiKey = await SecretStorageService.instance.getAuthApiKey()
  if (apiKey !== undefined && apiKey !== '<invalid-key>') {
    verifyApiKey(apiKey)
  } else {
    commands.executeCommand('setContext', 'openai.isApiKeyValid', false)
  }
}

export async function verifyApiKey(apiKey: string): Promise<boolean> {
  try {
    const baseurl = workspace
      .getConfiguration('vscode-openai')
      .get('baseurl') as string

    const configuration = new Configuration({
      apiKey: apiKey,
      basePath: baseurl,
    })
    const openai = new OpenAIApi(configuration)
    const response = await openai.listModels()
    if (response.status === 200) {
      SecretStorageService.instance.setAuthApiKey(apiKey)
      commands.executeCommand('setContext', 'openai.isApiKeyValid', true)
      return true
    }
  } catch (error: any) {
    SecretStorageService.instance.setAuthApiKey('<invalid-key>')
    const apiKey = await SecretStorageService.instance.getAuthApiKey()
    commands.executeCommand('setContext', 'openai.isApiKeyValid', false)
  }
  return false
}
