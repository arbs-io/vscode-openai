import {
  ExtensionContext,
  StatusBarAlignment,
  StatusBarItem,
  ThemeColor,
  window,
} from 'vscode'
import { VSCODE_OPENAI_REGISTER } from '../../contexts/constants'

export default class ExtensionStatusBarItem {
  private static _instance: ExtensionStatusBarItem

  constructor(private statusBarItem: StatusBarItem) {}

  static init(context: ExtensionContext): void {
    const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right)
    statusBarItem.name = 'vscode-openai'
    statusBarItem.command = VSCODE_OPENAI_REGISTER.APIKEY_COMMAND_ID
    statusBarItem.backgroundColor = new ThemeColor('statusBarItem.errorBackground')
    context.subscriptions.push(statusBarItem)
    ExtensionStatusBarItem._instance = new ExtensionStatusBarItem(statusBarItem)
  }

  static get instance(): ExtensionStatusBarItem {
    return ExtensionStatusBarItem._instance
  }

  public showStatusBarInformation(icon: string, text: string) {
    this.statusBarItem.text = `$(${icon}) ${text}`
    this.statusBarItem.backgroundColor = undefined
    this.statusBarItem.show()
  }
  
  public showStatusBarError(icon: string, text: string) {
    this.statusBarItem.text = `$(${icon}) ${text}`
    this.statusBarItem.backgroundColor = new ThemeColor('statusBarItem.errorBackground')
    this.statusBarItem.show()
  }
}
