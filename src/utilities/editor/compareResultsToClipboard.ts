import { commands, env, window } from 'vscode'
import { ConversationStorageService } from '@app/services'
import { IChatCompletion, IConversation, IPersonaOpenAI } from '@app/interfaces'
import { createChatCompletion } from '@app/apis/openai'
import { ChatCompletionConfigFactory } from '@app/services/configurationServices'

export const compareResultsToClipboard = async (
  persona: IPersonaOpenAI | undefined,
  prompt: string | undefined
): Promise<void> => {
  if (!persona || !prompt) {
    window.showErrorMessage('Persona or prompt is undefined.')
    return
  }

  const editor = window.activeTextEditor
  if (!editor) {
    window.showErrorMessage('No active text editor available.')
    return
  }

  const documentUri = editor.document.uri
  const conversation: IConversation =
    await ConversationStorageService.instance.create(persona)

  const chatCompletion: IChatCompletion = {
    content: prompt,
    author: 'vscode-openai-editor',
    timestamp: new Date().toLocaleString(),
    mine: false,
    completionTokens: 0,
    promptTokens: 0,
    totalTokens: 0,
  }

  const cfg = ChatCompletionConfigFactory.createConfig('inference_model')

  // Clearing the welcome message more idiomatically
  conversation.chatMessages.length = 0
  conversation.chatMessages.push(chatCompletion)

  try {
    const result = await createChatCompletion(conversation, cfg)
    const originalValue = await env.clipboard.readText()

    await env.clipboard.writeText(result?.content ?? '')
    await commands.executeCommand(
      'workbench.files.action.compareWithClipboard',
      documentUri
    )

    await env.clipboard.writeText(originalValue)
  } catch (error) {
    window.showErrorMessage(`An error occurred: ${error}`)
    console.error(error)
  }
}
