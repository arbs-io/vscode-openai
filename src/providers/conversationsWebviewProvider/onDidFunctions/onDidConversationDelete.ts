import { commands } from 'vscode'
import { IConversation } from '@app/types'

export const onDidConversationDelete = (conversation: IConversation): void => {
  commands.executeCommand('vscode-openai.conversation.delete', {
    data: conversation,
  })
}
