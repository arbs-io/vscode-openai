import { commands, ExtensionContext, Uri, window, workspace } from 'vscode'
import { listModels } from '../openai-utils'
import { VSCODE_OPENAI_REGISTER } from './constants'

export function registerDefaultModel(context: ExtensionContext) {
  _registerDefaultModel(context)
}

function _registerDefaultModel(context: ExtensionContext) {
  const commandHandler = async (uri: Uri) => {
    try {
      const models = await listModels()
      const model = await _quickPickModels(models)
      if (model !== undefined) {
        workspace
          .getConfiguration('vscode-openai')
          .update('default-model', model)
      }
    } catch (error) {
      console.log(error)
    }
  }
  context.subscriptions.push(
    commands.registerCommand(
      VSCODE_OPENAI_REGISTER.MODEL_COMMAND_ID,
      commandHandler
    )
  )
}
async function _quickPickModels(
  models: Array<string>
): Promise<string | undefined> {
  const result = await window.showQuickPick(models, {
    placeHolder: 'gpt-3.5-turbo',
  })
  return result
}
