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
  private static _requestConfig: IConfigurationProperties
  constructor(private statusBarItem: StatusBarItem) {}

  static async init(context: ExtensionContext): Promise<void> {
    ExtensionStatusBarItem._requestConfig = await ConfigurationService.instance.get()

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
    const baseUrl: URL = new URL(ExtensionStatusBarItem._requestConfig.baseUrl);
    return baseUrl.host
  }

  public showStatusBarInformation(icon: string, text: string) {
    this.statusBarItem.text = `$(${icon}) ${ExtensionStatusBarItem.serviceProvider} ${text}`
    this.statusBarItem.backgroundColor = undefined
    this.statusBarItem.show()
  }

  public showStatusBarError(icon: string, text: string) {
    this.statusBarItem.text = `$(${icon}) ${ExtensionStatusBarItem.serviceProvider} ${text}`
    this.statusBarItem.backgroundColor = new ThemeColor(
      'statusBarItem.errorBackground'
    )
    this.statusBarItem.show()
  }
}
