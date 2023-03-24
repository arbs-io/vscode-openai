import { Configuration, OpenAIApi } from 'openai'
import { ConfigurationService } from '../../vscodeUtilities'

export async function listModels(): Promise<string[]> {
  const models = new Array<string>()
  const requestConfig = await ConfigurationService.instance.get()

  const configuration = new Configuration({
    apiKey: requestConfig.apiKey,
    basePath: requestConfig.baseUrl,
  })
  const openai = new OpenAIApi(configuration)
  const response = await openai.listModels(requestConfig.requestConfig)

  response.data.data.forEach((model) => {
    if (model.id.startsWith('gpt') && model.id.indexOf('turbo')) {
      models.push(model.id)
    }
  })
  return models.sort((a, b) => b.localeCompare(a))
}
