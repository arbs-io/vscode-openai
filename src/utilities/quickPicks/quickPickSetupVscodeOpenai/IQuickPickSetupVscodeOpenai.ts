import { QuickPickItem } from 'vscode'
export interface IQuickPickSetupVscodeOpenai {
  title: string
  step: number
  totalSteps: number
  authType: QuickPickItem
}
