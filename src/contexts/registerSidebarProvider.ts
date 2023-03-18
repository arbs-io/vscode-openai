import { ExtensionContext, window, workspace } from 'vscode'
import {
  ConversationsWebviewProvider,
  PersonaWebviewProvider,
} from '../providers'
import { VSCODE_OPENAI_SIDEBAR } from './constants'

export function registerSidebarProvider(context: ExtensionContext) {
  _registerSidebarProvider(context)
  _registerConversationsWebviewProvider(context)
}

function _registerSidebarProvider(context: ExtensionContext) {
  const sidebarProvider = new PersonaWebviewProvider(context.extensionUri)
  const view = window.registerWebviewViewProvider(
    VSCODE_OPENAI_SIDEBAR.PERSONA_COMMAND_ID,
    sidebarProvider
  )
  context.subscriptions.push(view)
}

function _registerConversationsWebviewProvider(context: ExtensionContext) {
  const sidebarProvider = new ConversationsWebviewProvider(context.extensionUri)
  const view = window.registerWebviewViewProvider(
    VSCODE_OPENAI_SIDEBAR.CONVERSATIONS_COMMAND_ID,
    sidebarProvider
  )
  context.subscriptions.push(view)
}
