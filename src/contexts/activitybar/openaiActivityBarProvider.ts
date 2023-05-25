import { ExtensionContext, commands, window } from 'vscode'
import {
  ConversationsWebviewProvider,
  EmbeddingTreeDataProvider,
} from '@app/providers'
import { VSCODE_OPENAI_EMBEDDING, VSCODE_OPENAI_SIDEBAR } from '@app/constants'
import { OpenaiTreeItem } from '@app/providers/embeddingTreeDataProvider'
import { EmbeddingService } from '@app/services'

export class OpenaiActivityBarProvider {
  private static openaiActivityBarProviderInstance: OpenaiActivityBarProvider

  public static getOpenaiActivityBarProviderInstance(): OpenaiActivityBarProvider {
    if (!OpenaiActivityBarProvider.openaiActivityBarProviderInstance) {
      OpenaiActivityBarProvider.openaiActivityBarProviderInstance =
        new OpenaiActivityBarProvider()
    }
    return OpenaiActivityBarProvider.openaiActivityBarProviderInstance
  }

  //TODO: Move this function...
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

  //TODO: Move this function...
  private static embeddingTreeDataProviderInstance: EmbeddingTreeDataProvider

  public registerEmbeddingRefreshTreeDataCommand(context: ExtensionContext) {
    if (!OpenaiActivityBarProvider.embeddingTreeDataProviderInstance) {
      OpenaiActivityBarProvider.embeddingTreeDataProviderInstance =
        new EmbeddingTreeDataProvider(context)
    }
    commands.registerCommand(VSCODE_OPENAI_EMBEDDING.REFRESH_COMMAND_ID, () => {
      OpenaiActivityBarProvider.embeddingTreeDataProviderInstance.refresh()
    })
  }

  public registerEmbeddingConversationTreeDataCommand(
    context: ExtensionContext
  ) {
    if (!OpenaiActivityBarProvider.embeddingTreeDataProviderInstance) {
      OpenaiActivityBarProvider.embeddingTreeDataProviderInstance =
        new EmbeddingTreeDataProvider(context)
    }

    commands.registerCommand(
      VSCODE_OPENAI_EMBEDDING.CONVERSATION_COMMAND_ID,
      (node: OpenaiTreeItem) =>
        window.showInformationMessage(
          `ConversationTreeDataCommand: ${node.label}.`
        )
    )
  }

  public registerEmbeddingDeleteTreeDataCommand(context: ExtensionContext) {
    if (!OpenaiActivityBarProvider.embeddingTreeDataProviderInstance) {
      OpenaiActivityBarProvider.embeddingTreeDataProviderInstance =
        new EmbeddingTreeDataProvider(context)
    }

    commands.registerCommand(
      VSCODE_OPENAI_EMBEDDING.DELETE_COMMAND_ID,
      (node: OpenaiTreeItem) => {
        window
          .showInformationMessage(
            'Are you sure you want to delete this embedding?',
            'Yes',
            'No'
          )
          .then((answer) => {
            if (answer === 'Yes') {
              EmbeddingService.instance.delete(node.embeddingId)
              OpenaiActivityBarProvider.embeddingTreeDataProviderInstance.refresh()
            }
          })
      }
    )
  }
}
