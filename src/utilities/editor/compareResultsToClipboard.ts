import { commands, env, window } from 'vscode'
import { ConversationStorageService } from '@app/services'
import { IChatCompletion, IConversation, IPersonaOpenAI } from '@app/types'
import { createChatCompletion } from '@app/apis/openai'
import { ChatCompletionConfigFactory } from '@app/services/configurationServices'

export const compareResultsToClipboard = async (
  persona: IPersonaOpenAI | undefined,
  prompt: string | undefined
): Promise<void> => {
  if (persona && prompt) {
    const editor = window.activeTextEditor
    if (editor) {
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

      conversation.chatMessages.splice(0) //clear welcome message
      conversation.chatMessages.push(chatCompletion)
      const result = await createChatCompletion(conversation, cfg)

      const originalValue = await env.clipboard.readText()
      try {
        await env.clipboard.writeText(result?.content ? result?.content : '')
        await commands.executeCommand(
          'workbench.files.action.compareWithClipboard',
          editor.document.uri
        )
      } catch (error) {
        window.showErrorMessage(error as string)
      } finally {
        await env.clipboard.writeText(originalValue)
      }
    }
  }
}
