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

    const chatCompletionModels = [
      'gpt-4',
      'gpt-4-0314',
      'gpt-4-32k',
      'gpt-4-32k-0314',
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-0301',
    ]
    response.data.data.forEach((model) => {
      if (chatCompletionModels.includes(model.id)) {
        models.push(model.id)
      }
    })
    return models.sort((a, b) => b.localeCompare(a))
  } catch (error: any) {
    errorHandler(error)
  }
  return models
}
