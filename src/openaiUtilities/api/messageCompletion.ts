import { workspace } from 'vscode'
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from 'openai'
import {
  ExtensionStatusBarItem,
  SecretStorageService,
} from '../../vscodeUtilities'
import { IConversation } from '../../interfaces'
import { getRequestConfig } from './getRequestConfig'

async function buildMessages(
  conversation: IConversation
): Promise<ChatCompletionRequestMessage[]> {
  const chatCompletion: ChatCompletionRequestMessage[] = []

  chatCompletion.push({
    role: ChatCompletionRequestMessageRoleEnum.System,
    content: `You are a ${conversation.persona.prompt.system}`,
  })

  conversation.chatMessages.forEach((chatMessage) => {
    chatCompletion.push({
      role: chatMessage.mine
        ? ChatCompletionRequestMessageRoleEnum.User
        : ChatCompletionRequestMessageRoleEnum.Assistant,
      content: chatMessage.content,
    })
  })
  return chatCompletion
}

export async function messageCompletion(
  conversation: IConversation
): Promise<string> {
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

    const chatCompletions = await buildMessages(conversation)

    const completion = await openai.createChatCompletion(
      {
        model: requestConfig.defaultModel,
        messages: chatCompletions,
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
