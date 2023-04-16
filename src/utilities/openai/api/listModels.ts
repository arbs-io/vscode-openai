import { Configuration, OpenAIApi } from 'openai'
import { ConfigurationService } from '../../../services'

export async function listModels(): Promise<Array<string>> {
  const models = new Array<string>()
  const apiKey = await ConfigurationService.instance.getApiKey()

  const configuration = new Configuration({
    apiKey: apiKey,
    basePath: ConfigurationService.instance.baseUrl,
  })
  const openai = new OpenAIApi(configuration)
  const response = await openai.listModels(
    await ConfigurationService.instance.getRequestConfig()
  )

  response.data.data.forEach((model) => {
    if (model.id.startsWith('gpt') && model.id.indexOf('turbo')) {
      models.push(model.id)
    }
  })
  return models.sort((a, b) => b.localeCompare(a))
}
