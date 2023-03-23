import { workspace } from 'vscode'
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from 'openai'
import { ExtensionStatusBarItem } from '../../vscodeUtilities'
import { getRequestConfig } from './getRequestConfig'

export async function promptCompletion(prompt: string): Promise<string> {
  try {
    const requestConfig = await getRequestConfig()

    ExtensionStatusBarItem.instance.showStatusBarInformation(
      'sync~spin',
      'Running'
    )
    if (!requestConfig.apiKey) return 'invalid ApiKey'

    const configuration = new Configuration({
      apiKey: requestConfig.apiKey,
      basePath: requestConfig.inferenceUrl,
    })
    const openai = new OpenAIApi(configuration)

    const completion = await openai.createChatCompletion(
      {
        model: requestConfig.defaultModel,
        messages: [
          {
            role: ChatCompletionRequestMessageRoleEnum.Assistant,
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      },
      requestConfig.requestConfig
    )

    const answer = completion.data.choices[0].message?.content

    ExtensionStatusBarItem.instance.showStatusBarInformation('unlock', '')
    return answer ? answer : ''
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status)
      console.log(error.response.data)
      throw error
    } else {
      console.log(error.message)
      throw error
    }
  }
}
