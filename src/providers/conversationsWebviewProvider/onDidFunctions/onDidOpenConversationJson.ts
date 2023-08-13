import { commands } from 'vscode'
import { IConversation } from '@app/types'

export const onDidOpenConversationJson = (
  conversation: IConversation
): void => {
  commands.executeCommand('_vscode-openai.conversation.show.json', {
    data: conversation,
  })
}
