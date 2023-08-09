import { ExtensionContext, Disposable } from 'vscode'
import { CommandManager } from './commandManager'
import {
  NewConversationStandardCommand,
  NewConversationPersonaCommand,
  ClipboardCopySummaryCommand,
  ConversationsRefreshCommand,
  ConversationsDeleteAllCommand,
  ConversationsSettingsCommand,
} from './conversations'

export { CommandManager }
export function registerVscodeOpenAICommands(
  context: ExtensionContext,
  commandManager: CommandManager
): Disposable {
  commandManager.register(new NewConversationStandardCommand())
  commandManager.register(new NewConversationPersonaCommand(context))
  commandManager.register(new ClipboardCopySummaryCommand())
  commandManager.register(new ConversationsRefreshCommand())
  commandManager.register(new ConversationsDeleteAllCommand())
  commandManager.register(new ConversationsSettingsCommand())

  return commandManager
}
