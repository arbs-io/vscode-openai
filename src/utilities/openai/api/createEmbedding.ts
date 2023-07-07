import { Configuration, OpenAIApi } from 'openai'
import { backOff, BackoffOptions } from 'exponential-backoff'
import { StatusBarHelper } from '@app/utilities/vscode'
import { SettingConfigurationService } from '@app/services'
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
    const model = await SettingConfigurationService.instance.embeddingModel
    const apiKey = await SettingConfigurationService.instance.getApiKey()
    if (!apiKey) throw new Error('Invalid Api Key')

    const configuration = new Configuration({
      apiKey: apiKey,
      basePath: SettingConfigurationService.instance.embeddingUrl,
    })
    const openai = new OpenAIApi(configuration)

    const requestConfig =
      await SettingConfigurationService.instance.getRequestConfig()

    const backoffOptions: BackoffOptions = {
      numOfAttempts: 20,
      retry: async (_e: any, _attemptNumber: number) => {
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

    StatusBarHelper.instance.showStatusBarInformation(
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
