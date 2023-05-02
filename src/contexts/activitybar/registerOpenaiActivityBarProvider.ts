import { ExtensionContext, window } from 'vscode'
import { OpenaiActivityBarFacade } from './openaiActivityBarFacade'
import { OpenaiActivityBarCommand } from './openaiActivityBarCommand'

// Description: This function registers the OpenaiActivityBarProvider with the given ExtensionContext.
// Input: context - an object of type ExtensionContext that represents the extension context.
// Output: None
function registerOpenaiActivityBarProvider(context: ExtensionContext) {
  const facade = new OpenaiActivityBarFacade()
  const command = new OpenaiActivityBarCommand(context, facade)
  command.execute()
}

export { registerOpenaiActivityBarProvider }
