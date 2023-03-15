import { Configuration, OpenAIApi } from 'openai'
import { workspace } from 'vscode'
import { SecretStorageService } from '../../vscodeUtilities'

export async function listModels(): Promise<string[]> {
  const models = new Array<string>()
  const apiKey = await SecretStorageService.instance.getAuthApiKey()

  const ws = workspace.getConfiguration('vscode-openai')
  const baseurl = ws.get('baseurl') as string

  const configuration = new Configuration({
    apiKey: apiKey,
    basePath: baseurl,
  })
  const openai = new OpenAIApi(configuration)
  const response = await openai.listModels()

  response.data.data.forEach((model) => {
    if (model.id.startsWith('gpt') && model.id.indexOf('turbo')) {
      models.push(model.id)
    }
  })
  return models.sort((a, b) => b.localeCompare(a))
}
