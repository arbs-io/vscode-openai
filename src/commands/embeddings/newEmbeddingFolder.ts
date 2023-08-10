import { OpenDialogOptions, Uri, window, workspace } from 'vscode'
import { Command } from '../commandManager'
import { EmbeddingStorageService } from '@app/services'
import { createDebugNotification } from '@app/utilities/node'
import { embeddingResource } from '@app/utilities/embedding'

export default class NewEmbeddingFolderCommand implements Command {
  public readonly id = 'vscode-openai.embeddings.new.folder'
  public constructor() {}

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
            if (!fileObject) return
            EmbeddingStorageService.instance.update(fileObject)
          })
        })
      }
    })
  }
}
