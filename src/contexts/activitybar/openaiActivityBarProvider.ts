import { ExtensionContext, commands, window } from 'vscode'
import {
  ConversationsWebviewProvider,
  FileEmbeddingTreeDataProvider,
} from '@app/providers'
import { VSCODE_OPENAI_EMBEDDING, VSCODE_OPENAI_SIDEBAR } from '@app/contexts'
import { VscodeOpenaiTreeItem } from '@app/providers/fileEmbeddingTreeDataProvider/fileEmbeddingTreeDataProvider'

export class OpenaiActivityBarProvider {
  private static instance: OpenaiActivityBarProvider

  public static getInstance(): OpenaiActivityBarProvider {
    if (!OpenaiActivityBarProvider.instance) {
      OpenaiActivityBarProvider.instance = new OpenaiActivityBarProvider()
    }
    return OpenaiActivityBarProvider.instance
  }

  public registerConversationsWebviewView(context: ExtensionContext) {
    const sidebarProvider = new ConversationsWebviewProvider(
      context.extensionUri
    )
    const view = window.registerWebviewViewProvider(
      VSCODE_OPENAI_SIDEBAR.CONVERSATIONS_COMMAND_ID,
      sidebarProvider
    )
    context.subscriptions.push(view)
  }

  public registerEmbeddingConversationTreeDataCommand(
    context: ExtensionContext
  ) {
    new FileEmbeddingTreeDataProvider(context)
    commands.registerCommand(
      VSCODE_OPENAI_EMBEDDING.CONVERSATION_COMMAND_ID,
      (node: VscodeOpenaiTreeItem) =>
        window.showInformationMessage(
          `ConversationTreeDataCommand: ${node.label}.`
        )
    )
  }

  public registerEmbeddingDeleteTreeDataCommand(context: ExtensionContext) {
    new FileEmbeddingTreeDataProvider(context)
    commands.registerCommand(
      VSCODE_OPENAI_EMBEDDING.DELETE_COMMAND_ID,
      (node: VscodeOpenaiTreeItem) => {
        window
          .showInformationMessage(
            'Are you sure you want to delete this item?',
            'Yes',
            'No'
          )
          .then((answer) => {
            if (answer === 'Yes') {
              window.showInformationMessage(
                `DeleteTreeDataCommand: ${node.label}.`
              )
            }
          })
      }
    )
  }
}
