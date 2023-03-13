import { ExtensionContext, window } from 'vscode'
import { ChatConversationsProvider } from '../panels/chatConversationsProvider'
import { ChatPersonaProvider } from '../panels/chatPersonaProvider'
import {
  SIDEBAR_CHATCONVERSATIONS_COMMAND_ID,
  SIDEBAR_PERSONA_COMMAND_ID,
} from './openaiCommands'

export function registerSidebarProvider(context: ExtensionContext) {
  _registerSidebarProvider(context)
  _registerChatHistoryProvider(context)
}

function _registerSidebarProvider(context: ExtensionContext) {
  const sidebarProvider = new ChatPersonaProvider(context.extensionUri)
  const view = window.registerWebviewViewProvider(
    SIDEBAR_PERSONA_COMMAND_ID,
    sidebarProvider
  )
  context.subscriptions.push(view)
}
function _registerChatHistoryProvider(context: ExtensionContext) {
  const sidebarProvider = new ChatConversationsProvider(context.extensionUri)
  const view = window.registerWebviewViewProvider(
    SIDEBAR_CHATCONVERSATIONS_COMMAND_ID,
    sidebarProvider
  )
  context.subscriptions.push(view)
}
