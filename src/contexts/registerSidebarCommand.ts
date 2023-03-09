import { ExtensionContext, window } from 'vscode'
import { PersonaSidebarProvider } from '../panels/personaSidebarProvider'
import { SIDEBAR_PERSONA_COMMAND_ID } from './openaiCommands'

export function registerSidebarCommand(context: ExtensionContext) {
  _registerCommand(context)
}

function _registerCommand(context: ExtensionContext) {
  const sidebarProvider = new PersonaSidebarProvider(context.extensionUri)
  context.subscriptions.push(
    window.registerWebviewViewProvider(
      SIDEBAR_PERSONA_COMMAND_ID,
      sidebarProvider
    )
  )
}
