import { Configuration, OpenAIApi } from 'openai'
import { errorHandler } from './errorHandler'
import { ModelCapabiliy } from './modelCapabiliy'

export async function listModelsOpenAI(
  apiKey: string,
  baseUrl: string,
  modelCapabiliy: ModelCapabiliy
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
      if (
        (modelCapabiliy == ModelCapabiliy.ChatCompletion &&
          model.id.startsWith('gpt')) ||
        (modelCapabiliy == ModelCapabiliy.Embedding &&
          model.id.indexOf('embedding') > 0)
      ) {
        models.push(model.id)
      }
    })
    return models.sort((a, b) => b.localeCompare(a))
  } catch (error: any) {
    errorHandler(error)
  }
  return models
}
