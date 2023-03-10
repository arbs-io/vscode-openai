import { ExtensionContext } from 'vscode'
import { registerCompletionCommand } from './registerCompletionCommand'
import { registerApiKeyCommand } from './registerApiKeyCommand'
import { registerDefaultModel } from './registerDefaultModel'
import { registerShowClaimsetPreviewCommand } from './registerGptChatPanelCommand'
import { registerSidebarProvider } from './registerSidebarProvider'

export function registerCommands(context: ExtensionContext) {
  registerApiKeyCommand(context)
  registerDefaultModel(context)
  registerCompletionCommand(context)
  registerShowClaimsetPreviewCommand(context)
  registerSidebarProvider(context)
}
