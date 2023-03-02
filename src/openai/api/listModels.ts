import { Configuration, OpenAIApi } from 'openai'
import { workspace } from 'vscode'
import SecretStorageService from '../../services/secretStorageService'

export async function listModels(): Promise<string[]> {
  const models = new Array<string>()
  const apiKey = await SecretStorageService.instance.getAuthApiKey()
  const baseurl = workspace
    .getConfiguration('vscode-openai')
    .get('baseurl') as string

  const configuration = new Configuration({
    apiKey: apiKey,
    basePath: baseurl,
  })
  const openai = new OpenAIApi(configuration)
  const response = await openai.listModels()

  response.data.data.forEach((model) => {
    if (
      model.id.startsWith('text') ||
      model.id.startsWith('code') ||
      model.id.indexOf('turbo')
    ) {
      models.push(model.id)
    }
  })
  return models.sort((a, b) => b.localeCompare(a))
}
