import { commands } from 'vscode'
import { IConversation } from '@app/types'

export const onDidOpenConversationMarkdown = (
  conversation: IConversation
): void => {
  commands.executeCommand('_vscode-openai.conversation.open.markdown', {
    data: conversation,
  })
}
