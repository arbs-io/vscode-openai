import { ExtensionContext, window } from 'vscode'
import { ChatConversationsProvider } from '../panels/chatConversationsProvider'
import { ChatPersonaProvider } from '../panels/chatPersonaProvider'
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
  const sidebarProvider = new ChatConversationsProvider(context.extensionUri)
  const view = window.registerWebviewViewProvider(
    VSCODE_OPENAI_SIDEBAR.CONVERSATIONS_COMMAND_ID,
    sidebarProvider
  )
  context.subscriptions.push(view)
}
