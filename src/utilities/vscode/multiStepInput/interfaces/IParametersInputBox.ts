import { QuickInputButton } from 'vscode'

export interface IParametersInputBox {
  title: string
  step: number
  totalSteps: number
  value: string
  valueSelection?: [number, number]
  prompt: string
  validate: (value: string) => Promise<string | undefined>
  buttons?: QuickInputButton[]
  ignoreFocusOut?: boolean
  placeholder?: string
  shouldResume: () => Thenable<boolean>
}
