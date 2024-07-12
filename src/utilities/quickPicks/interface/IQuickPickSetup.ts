import { QuickPickItem } from 'vscode'

export interface IQuickPickSetup {
  serviceProvider: string
  title: string
  step: number
  totalSteps: number
  baseUrl: string
  authenticationType: QuickPickItem
  authApiKey: string
  modelInferenceCustom: string
  modelInference: QuickPickItem
  modelScm: QuickPickItem
  modelEmbedding: QuickPickItem
}
