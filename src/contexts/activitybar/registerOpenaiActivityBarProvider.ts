import { ExtensionContext, window } from 'vscode'
import { OpenaiActivityBarFacade } from './openaiActivityBarFacade'
import { OpenaiActivityBarCommand } from './openaiActivityBarCommand'
import { handleError } from '@app/utilities/node'

// Description: This function registers the OpenaiActivityBarProvider with the given ExtensionContext.
// Input: context - an object of type ExtensionContext that represents the extension context.
// Output: None
function registerOpenaiActivityBarProvider(context: ExtensionContext) {
  try {
    const facade = new OpenaiActivityBarFacade()
    const command = new OpenaiActivityBarCommand(context, facade)
    command.execute()
  } catch (error) {
    handleError(error)
  }
}

export { registerOpenaiActivityBarProvider }
