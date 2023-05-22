import { ExtensionContext } from 'vscode'
import { OpenaiActivityBarProvider } from './openaiActivityBarProvider'
/**
 * A facade class for the OpenaiActivityBarProvider that provides an interface to register all views.
 * @class
 */
export class OpenaiActivityBarFacade {
  /**
   * The instance of the OpenaiActivityBarProvider.
   * @private
   */
  private sidebarInstance: OpenaiActivityBarProvider

  /**
   * Creates a new instance of the OpenaiActivityBarFacade and initializes the sidebarInstance.
   * @constructor
   */
  constructor() {
    this.sidebarInstance = OpenaiActivityBarProvider.getInstance()
  }

  /**
   * Registers all views with the provided context.
   * @param {ExtensionContext} context - The extension context to register the views with.
   */
  public registerAllViews(context: ExtensionContext) {
    this.sidebarInstance.registerPersonaWebviewView(context)
    this.sidebarInstance.registerConversationsWebviewView(context)
    this.sidebarInstance.registerEmbeddingConversationTreeDataCommand(context)
    this.sidebarInstance.registerEmbeddingDeleteTreeDataCommand(context)
  }
}
