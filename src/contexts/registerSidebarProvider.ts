import { ExtensionContext, window } from 'vscode'
import { ChatHistoryProvider } from '../panels/chatHistoryProvider'
import { PersonaProvider } from '../panels/personaProvider'
import {
  SIDEBAR_CHATHISTORY_COMMAND_ID,
  SIDEBAR_PERSONA_COMMAND_ID,
} from './openaiCommands'

export function registerSidebarProvider(context: ExtensionContext) {
  _registerSidebarProvider(context)
  _registerChatHistoryProvider(context)
}

function _registerSidebarProvider(context: ExtensionContext) {
  const sidebarProvider = new PersonaProvider(context.extensionUri)
  context.subscriptions.push(
    window.registerWebviewViewProvider(
      SIDEBAR_PERSONA_COMMAND_ID,
      sidebarProvider
    )
  )
}
function _registerChatHistoryProvider(context: ExtensionContext) {
  const sidebarProvider = new ChatHistoryProvider(context.extensionUri)
  context.subscriptions.push(
    window.registerWebviewViewProvider(
      SIDEBAR_CHATHISTORY_COMMAND_ID,
      sidebarProvider
    )
  )
}
