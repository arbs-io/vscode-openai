import { workspace } from 'vscode'
import {
  createDebugNotification,
  createErrorNotification,
} from '@app/apis/node'

export default class ConfigValue {
  protected getConfigValue<T>(configName: string): T {
    const ws = workspace.getConfiguration('vscode-openai')
    return ws.get(configName) as T
  }

  protected setConfigValue<T>(configName: string, value: T): void {
    const ws = workspace.getConfiguration('vscode-openai')
    const setAsGlobal = ws.inspect(configName)?.workspaceValue == undefined
    ws.update(configName, value, setAsGlobal)
      .then(() => {
        createDebugNotification(`setting ${configName} ${value}`)
      })
      .then(undefined, (err) => {
        createErrorNotification(`${err}`)
      })
  }
}
