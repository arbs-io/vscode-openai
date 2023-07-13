import { commands } from 'vscode'

const featureMap = new Map<string, boolean>([])
/**
 * Sets a feature flag in the Visual Studio Code context.
 *
 * @param context - The name of the feature flag to set.
 * @param status - The boolean value representing the state of the feature
 *                 flag (true for enabled, false for disabled).
 */
export const setFeatureFlag = (context: string, status: boolean): void => {
  featureMap.set(context, status)
  commands.executeCommand('setContext', context, status)
}

export const getFeatureFlag = (context: string): boolean => {
  const featureEnabled = featureMap.get(context)
  return featureEnabled ?? false
}
