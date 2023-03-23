import {
  ExtensionContext,
  StatusBarAlignment,
  StatusBarItem,
  ThemeColor,
  window,
  workspace,
} from 'vscode'
import { VSCODE_OPENAI_REGISTER } from '../../contexts/constants'

export default class ExtensionStatusBarItem {
  private static _instance: ExtensionStatusBarItem
  private static _serviceProvider: string

  constructor(private statusBarItem: StatusBarItem) {}

  static init(context: ExtensionContext): void {
    const ws = workspace.getConfiguration('vscode-openai')
    this._serviceProvider = ws.get('serviceProvider') as string

    const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right)
    statusBarItem.name = 'vscode-openai'
    statusBarItem.command = VSCODE_OPENAI_REGISTER.APIKEY_COMMAND_ID
    statusBarItem.backgroundColor = new ThemeColor(
      'statusBarItem.errorBackground'
    )
    context.subscriptions.push(statusBarItem)
    ExtensionStatusBarItem._instance = new ExtensionStatusBarItem(statusBarItem)
  }

  static get instance(): ExtensionStatusBarItem {
    return ExtensionStatusBarItem._instance
  }

  static get serviceProvider(): string {
    return ExtensionStatusBarItem._serviceProvider
  }
  static set serviceProvider(value: string) {
    ExtensionStatusBarItem._serviceProvider = value
  }

  public showStatusBarInformation(icon: string, text: string) {
    this.statusBarItem.text = `$(${icon}) ${ExtensionStatusBarItem.serviceProvider} ${text}`
    this.statusBarItem.backgroundColor = undefined
    this.statusBarItem.show()
  }

  public showStatusBarError(icon: string, text: string) {
    this.statusBarItem.text = `$(${icon}) ${ExtensionStatusBarItem._instance} ${text}`
    this.statusBarItem.backgroundColor = new ThemeColor(
      'statusBarItem.errorBackground'
    )
    this.statusBarItem.show()
  }
}
