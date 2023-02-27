import { Configuration, OpenAIApi } from 'openai'
import SecretStorageService from '../services/secretStorageService'

export async function listModels(): Promise<string[]> {
  const models = new Array<string>()
  const apiKey = await SecretStorageService.instance.getAuthApiKey()

  const configuration = new Configuration({
    apiKey: apiKey,
  })
  const openai = new OpenAIApi(configuration)
  const response = await openai.listModels()

  response.data.data.forEach((model) => {
    if (model.id.startsWith('code')) {
      models.push(model.id)
    }
  })
  return models
}
