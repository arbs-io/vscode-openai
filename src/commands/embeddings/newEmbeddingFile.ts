import { OpenDialogOptions, window } from 'vscode'
import { Command } from '../commandManager'
import { EmbeddingStorageService } from '@app/services'
import {
  createDebugNotification,
  createErrorNotification,
} from '@app/apis/node'
import { embeddingResource } from '@app/apis/embedding'

export default class NewEmbeddingFileCommand implements Command {
  public readonly id = 'vscode-openai.embeddings.new.file'
  public constructor() {}

  public async execute() {
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
}
