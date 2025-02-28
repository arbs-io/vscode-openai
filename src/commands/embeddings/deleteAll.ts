import { EmbeddingStorageService } from '@app/services'
import { ICommand } from '@app/commands'
import { window } from 'vscode'

export default class DeleteAllEmbeddingsCommand implements ICommand {
  public readonly id = '_vscode-openai.embeddings.delete-all'

  public async execute() {
    window
      .showInformationMessage(
        'Are you sure you want to delete ALL embeddings?',
        'Yes',
        'No'
      )
      .then((answer) => {
        if (answer === 'Yes') {
          EmbeddingStorageService.instance.deleteAll()
        }
      })
  }
}
