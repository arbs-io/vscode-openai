import {
  ExtensionContext,
  OpenDialogOptions,
  Uri,
  commands,
  window,
  workspace,
} from 'vscode'
import { VSCODE_OPENAI_EMBEDDING } from '@app/constants'
import {
  ConversationStorageService,
  EmbeddingStorageService,
} from '@app/services'
import {
  createDebugNotification,
  createErrorNotification,
} from '@app/utilities/node'
import { embeddingResource } from '@app/utilities/embedding'
import { getQueryResourcePersona } from '@app/models'
import { IConversation } from '@app/types'

export function registerEmbeddingCommand(_context: ExtensionContext) {
  _registerCommandConversationAll()
  _registerCommandIndexFile()
  _registerCommandIndexFolder()
  _registerCommandIndexWebpage()
}

const _registerCommandConversationAll = (): void => {
  commands.registerCommand(
    VSCODE_OPENAI_EMBEDDING.CONVERSATION_ALL_COMMAND_ID,
    async () => {
      const persona = getQueryResourcePersona()
      const conversation: IConversation =
        await ConversationStorageService.instance.create(
          persona,
          VSCODE_OPENAI_EMBEDDING.RESOURCE_QUERY_ALL
        )
      ConversationStorageService.instance.update(conversation)
      ConversationStorageService.instance.show(conversation.conversationId)
    }
  )
}

const _registerCommandIndexFile = (): void => {
  // Register a command in VS Code that will be invoked when the user wants to index a file
  commands.registerCommand(
    VSCODE_OPENAI_EMBEDDING.INDEX_FILE_COMMAND_ID,
    () => {
      // Define the options for the open dialog
      const options: OpenDialogOptions = {
        canSelectMany: true,
        openLabel: 'vscode-openai index file',
        canSelectFiles: true,
        canSelectFolders: false,
      }

      // Show the open dialog and wait for the user to select a file
      window.showOpenDialog(options).then(async (fileUri) => {
        try {
          // Check if a file was selected
          if (fileUri?.[0]) {
            const uri = fileUri[0]
            if (!uri) return

            // Create a debug notification with the path of the selected file
            createDebugNotification(`file-index: ${uri.fsPath}`)

            // Generate an embedding for the selected file
            const fileObject = await embeddingResource(uri)
            if (!fileObject) return

            // Update the embedding storage with the new embedding
            EmbeddingStorageService.instance.update(fileObject)
          }
        } catch (error) {
          createErrorNotification(error)
        }
      })
    }
  )
}

const _registerCommandIndexFolder = (): void => {
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
          const uriFolders = folders[0]
          if (!uriFolders) return

          createDebugNotification(`folder-index: ${folders[0].fsPath}`)
          workspace.fs.readDirectory(uriFolders).then((files) => {
            files.forEach(async (file) => {
              const uriFile = Uri.joinPath(uriFolders, file[0])
              createDebugNotification(`file-index: ${uriFile.fsPath}`)
              const fileObject = await embeddingResource(uriFile)
              if (!fileObject) return
              EmbeddingStorageService.instance.update(fileObject)
            })
          })
        }
      })
    }
  )
}

const _registerCommandIndexWebpage = (): void => {
  commands.registerCommand(
    VSCODE_OPENAI_EMBEDDING.INDEX_WEB_COMMAND_ID,
    async () => {
      /*
      const webIndex = await window.showInputBox({
        title: 'vscode-openai index web uri',
        ignoreFocusOut: true,
        prompt: 'Provide the uri to be indexed for resource queries',
        placeHolder: 'https://code.visualstudio.com/api/references/vscode-api',
        validateInput: (text) => {
          const uri = Uri.parse(text)
          const webScheme: string[] = ['http', 'https']
          return webScheme.includes(uri.scheme) && uri.authority.length > 0
            ? null
            : 'Please provide a valid uri using either http or https'
        },
      })

      const uri = Uri.parse(webIndex!)
      if (!uri) return
      createDebugNotification(`web-index: ${webIndex}`)
      const fileObject = await embeddingResource(uri)
      if (!fileObject) return
      EmbeddingStorageService.instance.update(fileObject)
      */
    }
  )
}
