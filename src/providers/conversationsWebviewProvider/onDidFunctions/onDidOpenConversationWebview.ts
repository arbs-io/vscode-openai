import { commands } from 'vscode'
import { IConversation } from '@app/types'

export const onDidOpenConversationWebview = (
  conversation: IConversation
): void => {
  commands.executeCommand('vscode-openai.conversation.open.webview', {
    data: conversation,
  })
}
