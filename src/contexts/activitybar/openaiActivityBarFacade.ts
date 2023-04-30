import { ExtensionContext } from 'vscode'
import { OpenaiActivityBarProvider } from './openaiActivityBarProvider'

export class OpenaiActivityBarFacade {
  private sidebarInstance: OpenaiActivityBarProvider

  constructor() {
    this.sidebarInstance = OpenaiActivityBarProvider.getInstance()
  }

  public registerAllViews(context: ExtensionContext) {
    this.sidebarInstance.registerPersonaWebviewView(context)
    this.sidebarInstance.registerConversationsWebviewView(context)
  }
}
