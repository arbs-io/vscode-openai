import { window, workspace } from 'vscode'
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from 'openai'
import { SecretStorageService } from '../../vscode-utils'
import { IConversation } from '../../interfaces/IConversation'

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
    window.setStatusBarMessage(`$(sync~spin) vscode-openai`)
    const apiKey = await SecretStorageService.instance.getAuthApiKey()

    const ws = workspace.getConfiguration('vscode-openai')
    const baseurl = ws.get('baseurl') as string
    const model = ws.get('default-model') as string

    const configuration = new Configuration({
      apiKey: apiKey,
      basePath: baseurl,
    })
    const openai = new OpenAIApi(configuration)

    const chatCompletions = await buildMessages(conversation)

    const completion = await openai.createChatCompletion({
      model: model,
      messages: chatCompletions,
      temperature: 0.2,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })

    const answer = completion.data.choices[0].message?.content
    console.log(answer)

    window.setStatusBarMessage(`$(key) vscode-openai`)
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
