import { window, workspace } from 'vscode'
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from 'openai'
import {
  ExtensionStatusBarItem,
  SecretStorageService,
} from '../../vscodeUtilities'

export async function promptCompletion(prompt: string): Promise<string> {
  try {
    ExtensionStatusBarItem.instance.showStatusBarInformation(
      'sync~spin',
      'OpenAI: Running'
    )
    const apiKey = await SecretStorageService.instance.getAuthApiKey()

    const ws = workspace.getConfiguration('vscode-openai')
    const baseurl = ws.get('baseurl') as string
    const model = ws.get('default-model') as string

    const configuration = new Configuration({
      apiKey: apiKey,
      basePath: baseurl,
    })
    const openai = new OpenAIApi(configuration)

    const completion = await openai.createChatCompletion({
      model: model,
      messages: [
        {
          role: ChatCompletionRequestMessageRoleEnum.Assistant,
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })

    const answer = completion.data.choices[0].message?.content

    ExtensionStatusBarItem.instance.showStatusBarInformation('unlock', 'OpenAI')
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
