import { ExtensionContext } from 'vscode'
import { OpenaiActivityBarFacade } from './openaiActivityBarFacade'

interface ICommand {
  execute(): void
}

export class OpenaiActivityBarCommand implements ICommand {
  private context: ExtensionContext
  private facade: OpenaiActivityBarFacade

  constructor(context: ExtensionContext, facade: OpenaiActivityBarFacade) {
    this.context = context
    this.facade = facade
  }

  execute() {
    this.facade.registerAllViews(this.context)
  }
}
