import { ExtensionContext, window } from 'vscode'
import { ConversationsWebviewProvider } from '@app/providers'
import { VSCODE_OPENAI_SIDEBAR } from '@app/constants'

export function registerConversationsWebviewView(context: ExtensionContext) {
  const sidebarProvider = new ConversationsWebviewProvider(context.extensionUri)
  const view = window.registerWebviewViewProvider(
    VSCODE_OPENAI_SIDEBAR.CONVERSATIONS_COMMAND_ID,
    sidebarProvider
  )
  context.subscriptions.push(view)
}
