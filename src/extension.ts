import { ExtensionContext } from 'vscode'
import { registerCommands } from './contexts/registerCommands'

export function activate(context: ExtensionContext) {
  registerCommands(context)
}
