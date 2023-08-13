import { commands } from 'vscode'
import { IConversation } from '@app/types'

export const onDidOpenConversationJson = (
  conversation: IConversation
): void => {
  commands.executeCommand('vscode-openai.conversation.open.json', {
    data: conversation,
  })
}
