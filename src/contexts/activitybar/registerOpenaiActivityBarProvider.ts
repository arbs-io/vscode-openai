import { ExtensionContext, window } from 'vscode'
import { OpenaiActivityBarFacade } from './openaiActivityBarFacade'
import { OpenaiActivityBarCommand } from './openaiActivityBarCommand'

function registerOpenaiActivityBarProvider(context: ExtensionContext) {
  const facade = new OpenaiActivityBarFacade()
  const command = new OpenaiActivityBarCommand(context, facade)
  command.execute()
}

export { registerOpenaiActivityBarProvider }
