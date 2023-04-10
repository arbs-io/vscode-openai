import {
  ExtensionContext,
  StatusBarAlignment,
  StatusBarItem,
  ThemeColor,
  window,
  workspace,
} from 'vscode'
import { VSCODE_OPENAI_REGISTER } from '../../contexts/constants'
import { ConfigurationService } from '../../vscodeUtilities'
import { IConfigurationProperties } from '../../interfaces'
import { Url } from 'url'

export default class ExtensionStatusBarItem {
  private static _instance: ExtensionStatusBarItem
  constructor(private statusBarItem: StatusBarItem) {}

  static init(context: ExtensionContext) {
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

  public async showStatusBarInformation(icon: string, text: string) {
    this.statusBarItem.text = `$(${icon}) ${ConfigurationService.instance.host} ${text}`
    this.statusBarItem.backgroundColor = undefined
    this.statusBarItem.show()
  }

  public async showStatusBarError(icon: string, text: string) {
    this.statusBarItem.text = `$(${icon}) ${ConfigurationService.instance.host} ${text}`
    this.statusBarItem.backgroundColor = new ThemeColor(
      'statusBarItem.errorBackground'
    )
    this.statusBarItem.show()
  }
}
