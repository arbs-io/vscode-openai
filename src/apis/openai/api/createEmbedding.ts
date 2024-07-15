import { StatusBarServiceProvider } from '@app/apis/vscode'
import { SettingConfig as settingCfg } from '@app/services'
import { createOpenAI, errorHandler } from '@app/apis/openai'

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
    const model = settingCfg.embeddingModel
    const openai = await createOpenAI(settingCfg.embeddingUrl)
    const requestConfig = await settingCfg.getRequestConfig()

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
