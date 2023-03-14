import { ExtensionContext, window, workspace } from 'vscode'
import { ChatConversationsProvider } from '../Providers/chatConversationsProvider'
import { ChatPersonaProvider } from '../Providers/chatPersonaProvider'
import { VSCODE_OPENAI_SIDEBAR } from './constants'
import { ConversationProvider } from 'Providers/conversationsProvider'

export function registerSidebarProvider(context: ExtensionContext) {
  _registerSidebarProvider(context)
  _registerChatConversationsProvider(context)
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
function _registerChatConversationsProvider(context: ExtensionContext) {
  const sidebarProvider = new ChatConversationsProvider(context.extensionUri)
  const view = window.registerWebviewViewProvider(
    VSCODE_OPENAI_SIDEBAR.CHATCONVERSATIONS_COMMAND_ID,
    sidebarProvider
  )
  context.subscriptions.push(view)
}
function _registerConversationsProvider(context: ExtensionContext) {
  const tree = new ConversationProvider()
  window.registerTreeDataProvider(
    VSCODE_OPENAI_SIDEBAR.CHATCONVERSATIONS_COMMAND_ID,
    tree
  )
}
