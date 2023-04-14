import { QuickInputButton } from 'vscode'

export interface IParametersInputBox {
  title: string
  step: number
  totalSteps: number
  value: string
  prompt: string
  validate: (value: string) => Promise<string | undefined>
  buttons?: QuickInputButton[]
  ignoreFocusOut?: boolean
  placeholder?: string
  shouldResume: () => Thenable<boolean>
}
