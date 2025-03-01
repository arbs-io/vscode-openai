import { FileType, OpenDialogOptions, Uri, window, workspace } from 'vscode'

import { EmbeddingStorageService } from '@app/services'
import { ICommand } from '@app/commands'
import { createDebugNotification } from '@app/apis/node'
import { embeddingResource } from '@app/apis/embedding'

export default class NewEmbeddingFolderCommand implements ICommand {
  public readonly id = '_vscode-openai.embeddings.new.folder'

  public async execute() {
    const options: OpenDialogOptions = {
      canSelectMany: false,
      openLabel: 'vscode-openai index folder',
      canSelectFiles: false,
      canSelectFolders: true,
    }

    function indexFolder(uriFolder: Uri): void {
      createDebugNotification(`folder-index: ${uriFolder.fsPath}`)
      workspace.fs.readDirectory(uriFolder).then((files) => {
        files.forEach(async ([file, fileType]) => {
          switch (fileType) {
            case FileType.File: {
              const uriFile = Uri.joinPath(uriFolder, file)
              createDebugNotification(`file-index: ${uriFile.fsPath}`)
              const fileObject = await embeddingResource(uriFile)
              if (fileObject) {
                EmbeddingStorageService.instance.update(fileObject)
              }
              break
            }
            case FileType.Directory: {
              const uriNestedFolder = Uri.joinPath(uriFolder, file)
              indexFolder(uriNestedFolder)
              break
            }
            default:
              break
          }
        })
      })
    }

    window.showOpenDialog(options).then((folders) => {
      if (folders != null && folders.length > 0) {
        const uriFolder = folders[0]
        if (!uriFolder) return

        indexFolder(uriFolder)
      }
    })
  }
}
