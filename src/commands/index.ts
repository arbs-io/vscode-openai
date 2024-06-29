import { ExtensionContext, Disposable } from 'vscode'
import { CommandManager } from './commandManager'
import {
  NewConversationStandardCommand,
  NewConversationPersonaCommand,
  OpenConversationWebviewCommand,
  ShowConversationJsonCommand,
  ShowConversationMarkdownCommand,
  ClipboardCopyConversationSummaryCommand,
  DeleteConversationCommand,
} from './conversation'
import {
  RefreshConversationsCommand,
  DeleteAllConversationsCommand,
  SettingsConversationsCommand,
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
import { ClipboardCopyMessagesMessageCommand } from './messages'

export { Command, CommandManager } from './commandManager'
export function registerVscodeOpenAICommands(
  context: ExtensionContext,
  commandManager: CommandManager,
  embeddingTree: EmbeddingTreeDataProvider
): Disposable {
  // Conversation
  commandManager.register(new NewConversationStandardCommand())
  commandManager.register(new NewConversationPersonaCommand(context))
  commandManager.register(new OpenConversationWebviewCommand())
  commandManager.register(new ShowConversationJsonCommand())
  commandManager.register(new ShowConversationMarkdownCommand())
  commandManager.register(new ClipboardCopyConversationSummaryCommand())
  commandManager.register(new DeleteConversationCommand())

  // Conversations
  commandManager.register(new RefreshConversationsCommand())
  commandManager.register(new DeleteAllConversationsCommand())
  commandManager.register(new SettingsConversationsCommand())

  // Messages
  commandManager.register(new ClipboardCopyMessagesMessageCommand())

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
