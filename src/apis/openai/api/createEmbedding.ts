import { OpenAI } from 'openai'
import { backOff, BackoffOptions } from 'exponential-backoff'
import { StatusBarServiceProvider } from '@app/apis/vscode'
import {
  ConfigurationConversationService,
  ConfigurationSettingService,
} from '@app/services'
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
    const model = ConfigurationSettingService.instance.embeddingModel
    const apiKey = await ConfigurationSettingService.instance.getApiKey()
    if (!apiKey) throw new Error('Invalid Api Key')

    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: ConfigurationSettingService.instance.embeddingUrl,
    })

    const requestConfig =
      await ConfigurationSettingService.instance.getRequestConfig()

    const backoffOptions: BackoffOptions = {
      numOfAttempts: ConfigurationConversationService.instance.numOfAttempts,
      retry: async (_e: any, _attemptNumber: number) => {
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
        await sleep(1000)
        return true
      },
    }

    const result = await backOff(
      () =>
        openai.embeddings.create(
          {
            model,
            input,
          },
          requestConfig
        ),
      backoffOptions
    )

    StatusBarServiceProvider.instance.showStatusBarInformation(
      'sync~spin',
      `- embedding chunk [${itemCount}/${batchLength}]`
    )

    if (!result.data[0].embedding) {
      throw new Error('No embedding returned from the completions endpoint')
    }
    return result.data.map((d) => d.embedding)
  } catch (error: any) {
    errorHandler(error)
  }
  return undefined
}
