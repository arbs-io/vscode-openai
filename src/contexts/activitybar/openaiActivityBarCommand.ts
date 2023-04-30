import { ExtensionContext } from 'vscode'
import { OpenaiActivityBarFacade } from './openaiActivityBarFacade'

interface ICommandOpenai {
  execute(): void
}

export class OpenaiActivityBarCommand implements ICommandOpenai {
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
