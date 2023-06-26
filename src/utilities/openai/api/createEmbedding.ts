import { Configuration, OpenAIApi } from 'openai'
import { backOff, BackoffOptions } from 'exponential-backoff'
import { ExtensionStatusBarItem } from '@app/utilities/vscode'
import { ConfigurationService } from '@app/services'
import { errorHandler } from './errorHandler'
import { createDebugNotification } from '@app/utilities/node'

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
    const model = await ConfigurationService.instance.embeddingModel
    const apiKey = await ConfigurationService.instance.getApiKey()
    if (!apiKey) throw new Error('Invalid Api Key')

    const configuration = new Configuration({
      apiKey: apiKey,
      basePath: ConfigurationService.instance.embeddingUrl,
    })
    const openai = new OpenAIApi(configuration)

    const requestConfig = await ConfigurationService.instance.getRequestConfig()

    const backoffOptions: BackoffOptions = {
      numOfAttempts: 20,
      retry: async (e: any, attemptNumber: number) => {
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
        await sleep(1000)
        return true
      },
    }

    const result = await backOff(
      () =>
        openai.createEmbedding(
          {
            model,
            input,
          },
          requestConfig
        ),
      backoffOptions
    )

    ExtensionStatusBarItem.instance.showStatusBarInformation(
      'sync~spin',
      `- embedding chunk [${itemCount}/${batchLength}]`
    )

    if (!result.data.data[0].embedding) {
      throw new Error('No embedding returned from the completions endpoint')
    }
    return result.data.data.map((d) => d.embedding)
  } catch (error: any) {
    errorHandler(error)
  }
}
