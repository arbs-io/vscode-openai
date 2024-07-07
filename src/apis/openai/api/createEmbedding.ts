import { OpenAI } from 'openai'
import { StatusBarServiceProvider } from '@app/apis/vscode'
import { ConversationConfig as convCfg, SettingConfig } from '@app/services'
import { errorHandler } from './errorHandler'

type EmbeddingOptions = {
  input: string | string[]
  itemCount: number
  batchLength: number
}

export async function createEmbedding({
  input,
  itemCount,
  batchLength,
}: EmbeddingOptions): Promise<number[][] | undefined> {
  try {
    const model = SettingConfig.embeddingModel
    const azureApiVersion = SettingConfig.azureApiVersion
    const apiKey = await SettingConfig.getApiKey()
    if (!apiKey) throw new Error('Invalid Api Key')

    const openai = new OpenAI({
      apiKey: apiKey,
      defaultQuery: { 'api-version': azureApiVersion },
      defaultHeaders: { 'api-key': apiKey },
      baseURL: SettingConfig.embeddingUrl,
      maxRetries: convCfg.numOfAttempts,
      timeout: 20 * 1000, // Embedding should be fast, forcing quick retry
    })

    const requestConfig = await SettingConfig.getRequestConfig()

    const results = await openai.embeddings.create(
      {
        model,
        input,
      },
      requestConfig
    )

    StatusBarServiceProvider.instance.showStatusBarInformation(
      'sync~spin',
      `- embedding chunk [${itemCount}/${batchLength}]`
    )

    if (!results.data[0].embedding) {
      throw new Error('No embedding returned from the completions endpoint')
    }
    return results.data.map((d) => d.embedding)
  } catch (error: any) {
    errorHandler(error)
  }
  return undefined
}
