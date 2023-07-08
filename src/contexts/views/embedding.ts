import { ExtensionContext, commands, window } from 'vscode'
import { EmbeddingTreeDataProvider } from '@app/providers'
import { VSCODE_OPENAI_EMBEDDING } from '@app/constants'
import { EmbeddingTreeItem } from '@app/providers/embeddingTreeDataProvider'
import {
  ConversationStorageService,
  EmbeddingStorageService,
} from '@app/services'
import { IConversation } from '@app/interfaces'
import { getQueryResourcePersona } from '@app/models'

export function registerEmbeddingView(context: ExtensionContext) {
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
  _instance: EmbeddingTreeDataProvider
): void => {
  commands.registerCommand(
    VSCODE_OPENAI_EMBEDDING.CONVERSATION_COMMAND_ID,
    (node: EmbeddingTreeItem) => {
      const persona = getQueryResourcePersona()
      const conversation: IConversation =
        ConversationStorageService.instance.create(persona, [node.embeddingId])
      ConversationStorageService.instance.update(conversation)
      ConversationStorageService.instance.show(conversation.conversationId)
    }
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
            EmbeddingStorageService.instance.delete(node.embeddingId)
            instance.refresh()
          }
        })
    }
  )
}
