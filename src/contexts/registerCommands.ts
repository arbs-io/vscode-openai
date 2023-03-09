import { ExtensionContext } from 'vscode'
import { registerCompletionCommand } from './registerCompletionCommand'
import { registerApiKeyCommand } from './registerApiKeyCommand'
import { registerDefaultModel } from './registerDefaultModel'
import { registerShowClaimsetPreviewCommand } from './registerGptChatPanelCommand'
import { registerSidebarCommand } from './registerSidebarCommand'

export function registerCommands(context: ExtensionContext) {
  registerApiKeyCommand(context)
  registerDefaultModel(context)
  registerCompletionCommand(context)
  registerShowClaimsetPreviewCommand(context)
  registerSidebarCommand(context)
}
