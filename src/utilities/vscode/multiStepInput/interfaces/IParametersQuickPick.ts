import { QuickPickItem, QuickInputButton } from 'vscode'

export interface IParametersQuickPick<T extends QuickPickItem> {
  title: string
  step: number
  totalSteps: number
  items: T[]
  activeItem?: T
  ignoreFocusOut?: boolean
  placeholder: string
  buttons?: QuickInputButton[]
  shouldResume: () => Thenable<boolean>
}
