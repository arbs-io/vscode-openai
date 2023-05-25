import { commands } from 'vscode'

export const setFeatureFlag = (context: string, status: boolean): void => {
  commands.executeCommand('setContext', context, status)
}
