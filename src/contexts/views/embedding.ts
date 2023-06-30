import {
  ExtensionContext,
  OpenDialogOptions,
  Uri,
  commands,
  window,
  workspace,
} from 'vscode'
import { EmbeddingTreeDataProvider } from '@app/providers'
import { VSCODE_OPENAI_EMBEDDING } from '@app/constants'
import { EmbeddingTreeItem } from '@app/providers/embeddingTreeDataProvider'
import {
  ConversationStorageService,
  EmbeddingStorageService,
} from '@app/services'
import { IConversation } from '@app/interfaces'
import { QueryResourcePersona } from '@app/models'
import { createDebugNotification } from '@app/utilities/node'

export function registerEmbeddingView(context: ExtensionContext) {
  const instance = new EmbeddingTreeDataProvider(context)

  _registerCommandRefresh(instance)
  _registerCommandConversation(instance)
  _registerCommandDelete(instance)
}

commands.registerCommand(VSCODE_OPENAI_EMBEDDING.INDEX_FILE_COMMAND_ID, () => {
  const options: OpenDialogOptions = {
    canSelectMany: true,
    openLabel: 'vscode-openai index file',
    canSelectFiles: true,
    canSelectFolders: false,
  }

  window.showOpenDialog(options).then((fileUri) => {
    if (fileUri && fileUri[0]) {
      // console.log('Selected file: ' + fileUri[0].fsPath)
      createDebugNotification(`file-index: ${fileUri[0].fsPath}`)
    }
  })
})

commands.registerCommand(
  VSCODE_OPENAI_EMBEDDING.INDEX_FOLDER_COMMAND_ID,
  () => {
    const options: OpenDialogOptions = {
      canSelectMany: false,
      openLabel: 'vscode-openai index folder',
      canSelectFiles: false,
      canSelectFolders: true,
    }

    window.showOpenDialog(options).then((folders) => {
      if (folders != null && folders.length > 0) {
        createDebugNotification(`folder-index: ${folders[0].fsPath}`)
      }
    })
  }
)

commands.registerCommand(
  VSCODE_OPENAI_EMBEDDING.INDEX_WEB_COMMAND_ID,
  async () => {
    const webIndex = await window.showInputBox({
      title: 'vscode-openai index web uri',
      ignoreFocusOut: true,
      prompt: 'Provide the uri to be indexed for resource queries',
      placeHolder: 'https://code.visualstudio.com/api/references/vscode-api',
      validateInput: (text) => {
        window.showInformationMessage(`Validating: ${text}`)
        const uri = Uri.parse(text)
        const webScheme: string[] = ['http', 'https']
        return webScheme.includes(uri.scheme) && uri.authority.length > 0
          ? null
          : 'Please provide a valid uri using either http or https'
      },
    })

    createDebugNotification(`web-index: ${webIndex}`)
  }
)

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
    (node: EmbeddingTreeItem) => {
      const persona = QueryResourcePersona
      const conversation: IConversation =
        ConversationStorageService.instance.create(persona, [
          node.embeddingFileLite.embeddingId,
        ])
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
            EmbeddingStorageService.instance.delete(
              node.embeddingFileLite.embeddingId
            )
            instance.refresh()
          }
        })
    }
  )
}
