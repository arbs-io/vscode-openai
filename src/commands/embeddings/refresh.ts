import { EmbeddingTreeDataProvider } from '@app/providers'
import { Command } from '@app/commands'

export default class RefreshCommand implements Command {
  public readonly id = '_vscode-openai.embeddings.refresh'
  public constructor(private _instance: EmbeddingTreeDataProvider) {}

  public async execute() {
    this._instance.refresh()
  }
}
