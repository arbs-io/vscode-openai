import { Configuration, OpenAIApi } from 'openai'
import { errorHandler } from './errorHandler'

export async function openaiListModels(
  baseUrl: string,
  apiKey: string
): Promise<Array<string>> {
  const models = new Array<string>()
  try {
    const configuration = new Configuration({
      apiKey: apiKey,
      basePath: baseUrl,
    })
    const openai = new OpenAIApi(configuration)
    const response = await openai.listModels()

    response.data.data.forEach((model) => {
      if (model.id.startsWith('gpt')) {
        models.push(model.id)
      }
    })
    return models.sort((a, b) => b.localeCompare(a))
  } catch (error: any) {
    errorHandler(error)
  }
  return models
}
