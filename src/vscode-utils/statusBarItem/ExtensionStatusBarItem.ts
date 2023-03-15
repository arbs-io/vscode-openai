import {
  ExtensionContext,
  StatusBarAlignment,
  StatusBarItem,
  window,
} from 'vscode'

export default class ExtensionStatusBarItem {
  private static _instance: ExtensionStatusBarItem

  constructor(private statusBarItem: StatusBarItem) {}

  static init(context: ExtensionContext): void {
    const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right)
    statusBarItem.name = 'vscode-openai'
    context.subscriptions.push(statusBarItem)
    ExtensionStatusBarItem._instance = new ExtensionStatusBarItem(statusBarItem)
  }

  static get instance(): ExtensionStatusBarItem {
    return ExtensionStatusBarItem._instance
  }

  public setText(icon: string, text: string) {
    this.statusBarItem.text = `$(${icon}) ${text}`
    this.statusBarItem.show()
  }
}
