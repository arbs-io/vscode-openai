import { Configuration, OpenAIApi } from 'openai'
import { errorHandler } from './errorHandler'

export async function azureListModels(
  apiKey: string,
  baseUrl: string
): Promise<Array<string>> {
  try {
    const models = new Array<string>()
    const configuration = new Configuration({
      apiKey: apiKey,
      basePath: `https://${baseUrl}`,
    })
    const openai = new OpenAIApi(configuration)
    const response = await openai.listModels({
      headers: { 'api-key': apiKey },
      params: { 'api-version': '2023-03-15-preview' },
    })

    response.data.data.forEach((model: any) => {
      if (model.capabilities.chat_completion) {
        models.push(model.id)
      }
    })
    return models.sort((a, b) => b.localeCompare(a))
  } catch (error: any) {
    errorHandler(error)
    throw error
  }
}
