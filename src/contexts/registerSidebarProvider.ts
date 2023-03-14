import { ExtensionContext, window, workspace } from 'vscode'
import { ConversationsProvider } from '../providers/conversationsWebviewProvider'
import { ChatPersonaProvider } from '../providers/personaWebviewProvider'
import { VSCODE_OPENAI_SIDEBAR } from './constants'

export function registerSidebarProvider(context: ExtensionContext) {
  _registerSidebarProvider(context)
  _registerConversationsProvider(context)
}

function _registerSidebarProvider(context: ExtensionContext) {
  const sidebarProvider = new ChatPersonaProvider(context.extensionUri)
  const view = window.registerWebviewViewProvider(
    VSCODE_OPENAI_SIDEBAR.PERSONA_COMMAND_ID,
    sidebarProvider
  )
  context.subscriptions.push(view)
}

function _registerConversationsProvider(context: ExtensionContext) {
  const sidebarProvider = new ConversationsProvider(context.extensionUri)
  const view = window.registerWebviewViewProvider(
    VSCODE_OPENAI_SIDEBAR.CONVERSATIONS_COMMAND_ID,
    sidebarProvider
  )
  context.subscriptions.push(view)
}
