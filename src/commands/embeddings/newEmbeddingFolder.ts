import { OpenDialogOptions, Uri, window, workspace } from 'vscode'
import { Command } from '../commandManager'
import { EmbeddingStorageService } from '@app/services'
import { createDebugNotification } from '@app/apis/node'
import { embeddingResource } from '@app/apis/embedding'

export default class NewEmbeddingFolderCommand implements Command {
  public readonly id = 'vscode-openai.embeddings.new.folder'

  public async execute() {
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
            if (fileObject) {
              EmbeddingStorageService.instance.update(fileObject)
            }
          })
        })
      }
    })
  }
}
