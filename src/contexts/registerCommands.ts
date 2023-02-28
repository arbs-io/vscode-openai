import { ExtensionContext } from 'vscode'
import { registerCompletionComment } from './completionCommentCommands'
import { registerApiKeyCommand } from './registerApiKeyCommand'
import { registerDefaultModel } from './registerDefaultModel'

export function registerCommands(context: ExtensionContext) {
	registerApiKeyCommand(context)
  registerDefaultModel(context)
  registerCompletionComment(context)
}
