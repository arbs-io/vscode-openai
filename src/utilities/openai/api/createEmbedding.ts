import { Configuration, OpenAIApi } from 'openai'
import { ExtensionStatusBarItem } from '@app/utilities/vscode'
import { ConfigurationService } from '@app/services'
import { errorHandler } from './errorHandler'

type EmbeddingOptions = {
  input: string | string[]
  model?: string
}

export async function createEmbedding({
  input,
  model = 'text-embedding-ada-002',
}: EmbeddingOptions): Promise<number[][]> {
  try {
    ExtensionStatusBarItem.instance.showStatusBarInformation(
      'sync~spin',
      '- waiting'
    )
    const apiKey = await ConfigurationService.instance.getApiKey()
    if (!apiKey) throw new Error('Invalid Api Key')

    const configuration = new Configuration({
      apiKey: apiKey,
      basePath: ConfigurationService.instance.inferenceUrl,
    })
    const openai = new OpenAIApi(configuration)

    const requestConfig = await ConfigurationService.instance.getRequestConfig()

    const result = await openai.createEmbedding(
      {
        model,
        input,
      },
      requestConfig
    )

    if (!result.data.data[0].embedding) {
      throw new Error('No embedding returned from the completions endpoint')
    }
    return result.data.data.map((d) => d.embedding)
  } catch (error: any) {
    errorHandler(error)
  }
}
