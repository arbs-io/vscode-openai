import { commands } from 'vscode'

/**
 * Sets a feature flag in the Visual Studio Code context.
 *
 * @param context - The name of the feature flag to set.
 * @param status - The boolean value representing the state of the feature
 *                 flag (true for enabled, false for disabled).
 */
export const setFeatureFlag = (context: string, status: boolean): void => {
  commands.executeCommand('setContext', context, status)
}
