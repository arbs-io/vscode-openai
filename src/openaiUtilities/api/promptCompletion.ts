import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from 'openai'
import {
  ExtensionStatusBarItem,
  ConfigurationService,
} from '../../vscodeUtilities'

export async function promptCompletion(prompt: string): Promise<string> {
  try {
    const requestConfig = await ConfigurationService.instance.get()

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
        temperature: 0.2,
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
