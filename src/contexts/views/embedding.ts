import { ExtensionContext, commands, window } from 'vscode'
import { EmbeddingTreeDataProvider } from '@app/providers'
import { VSCODE_OPENAI_EMBEDDING } from '@app/constants'
import { EmbeddingTreeItem } from '@app/providers/embeddingTreeDataProvider'
import { EmbeddingService } from '@app/services'

export function registerEmbeddingRefreshTreeDataCommand(
  context: ExtensionContext
) {
  const instance = new EmbeddingTreeDataProvider(context)
  _registerCommandRefresh(instance)
  _registerCommandConversation(instance)
  _registerCommandDelete(instance)
}

const _registerCommandRefresh = (instance: EmbeddingTreeDataProvider): void => {
  commands.registerCommand(VSCODE_OPENAI_EMBEDDING.REFRESH_COMMAND_ID, () => {
    instance.refresh()
  })
}

const _registerCommandConversation = (
  instance: EmbeddingTreeDataProvider
): void => {
  commands.registerCommand(
    VSCODE_OPENAI_EMBEDDING.CONVERSATION_COMMAND_ID,
    (node: EmbeddingTreeItem) =>
      window.showInformationMessage(
        `ConversationTreeDataCommand: ${node.label}.`
      )
  )
}

const _registerCommandDelete = (instance: EmbeddingTreeDataProvider): void => {
  commands.registerCommand(
    VSCODE_OPENAI_EMBEDDING.DELETE_COMMAND_ID,
    (node: EmbeddingTreeItem) => {
      window
        .showInformationMessage(
          'Are you sure you want to delete this embedding?',
          'Yes',
          'No'
        )
        .then((answer) => {
          if (answer === 'Yes') {
            EmbeddingService.instance.delete(node.embeddingId)
            instance.refresh()
          }
        })
    }
  )
}
