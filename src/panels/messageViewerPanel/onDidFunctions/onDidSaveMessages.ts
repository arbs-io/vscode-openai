import { window } from 'vscode'
import { IChatCompletion, IConversation } from '@app/interfaces'
import {
  ConversationConfig as convCfg,
  ConversationStorageService,
} from '@app/services'
import { createChatCompletion } from '@app/apis/openai'
import { ChatCompletionConfigFactory } from '@app/services/configuration'

export const onDidSaveMessages = async (
  conversation: IConversation,
  chatMessages: IChatCompletion[]
): Promise<void> => {
  try {
    if (!conversation) return

    const cfg = ChatCompletionConfigFactory.createConfig('inference_model')

    const SUMMARY_THRESHOLD = convCfg.summaryThreshold
    const SUMMARY_MAX_LENGTH = convCfg.summaryMaxLength

    conversation.chatMessages = chatMessages
    ConversationStorageService.instance.update(conversation)

    //Add summary to conversation
    if (conversation.chatMessages.length % SUMMARY_THRESHOLD == 0) {
      //Deep clone for summary
      const summary = JSON.parse(JSON.stringify(conversation)) as IConversation
      summary.embeddingId = undefined // ignore embedding for summary
      const chatCompletion: IChatCompletion = {
        content: `Please summarise the content above. The summary must be less than ${SUMMARY_MAX_LENGTH} words. Only provide the facts within the content.`,
        author: 'summary',
        timestamp: new Date().toLocaleString(),
        mine: false,
        completionTokens: 0,
        promptTokens: 0,
        totalTokens: 0,
      }
      summary.chatMessages.push(chatCompletion)
      createChatCompletion(summary, cfg).then((result) => {
        if (!conversation) return
        if (result?.content) conversation.summary = result?.content
      })
    }
  } catch (error) {
    window.showErrorMessage(error as string)
  }
}
