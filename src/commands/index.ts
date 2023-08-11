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
import {
  EmbeddingsDeleteCommand,
  EmbeddingsRefreshCommand,
  NewConversationEmbeddingAllCommand,
  NewConversationEmbeddingCommand,
  NewEmbeddingFileCommand,
  NewEmbeddingFolderCommand,
  EmbeddingsSettingsCommand,
} from './embeddings'
import { GenerateCommentsCommand } from './scm'
import { ConfigurationShowQuickpick } from './configuration'

import { EmbeddingTreeDataProvider } from '@app/providers'
import {
  EditorSettingsCommand,
  EditorCodeCommentCommand,
  EditorCodeExplainCommand,
  EditorCodeBountyCommand,
  EditorCodeOptimizeCommand,
  EditorCodePatternsCommand,
} from './editor'

export { CommandManager }
export function registerVscodeOpenAICommands(
  context: ExtensionContext,
  commandManager: CommandManager,
  embeddingTree: EmbeddingTreeDataProvider
): Disposable {
  // Conversations
  commandManager.register(new NewConversationStandardCommand())
  commandManager.register(new NewConversationPersonaCommand(context))
  commandManager.register(new ClipboardCopySummaryCommand())
  commandManager.register(new ConversationsRefreshCommand())
  commandManager.register(new ConversationsDeleteAllCommand())
  commandManager.register(new ConversationsSettingsCommand())

  // Embeddings
  commandManager.register(new EmbeddingsRefreshCommand(embeddingTree))
  commandManager.register(new EmbeddingsDeleteCommand(embeddingTree))
  commandManager.register(new NewConversationEmbeddingCommand())
  commandManager.register(new NewConversationEmbeddingAllCommand())
  commandManager.register(new NewEmbeddingFolderCommand())
  commandManager.register(new NewEmbeddingFileCommand())
  commandManager.register(new EmbeddingsSettingsCommand())

  // SCM (git)
  commandManager.register(new GenerateCommentsCommand())

  // Editor
  commandManager.register(new EditorSettingsCommand())
  commandManager.register(new EditorCodeCommentCommand())
  commandManager.register(new EditorCodeExplainCommand())
  commandManager.register(new EditorCodeBountyCommand())
  commandManager.register(new EditorCodeOptimizeCommand())
  commandManager.register(new EditorCodePatternsCommand())

  // Configuration
  commandManager.register(new ConfigurationShowQuickpick(context))

  return commandManager
}
