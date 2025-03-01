import { window } from 'vscode'
import { ICommand } from '@app/commands'
import { EmbeddingStorageService } from '@app/services'

export default class RefreshCommand implements ICommand {
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
