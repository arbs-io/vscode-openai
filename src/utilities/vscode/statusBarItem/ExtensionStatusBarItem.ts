import {
  ExtensionContext,
  StatusBarAlignment,
  StatusBarItem,
  ThemeColor,
  window,
  workspace,
} from 'vscode'
import { VSCODE_OPENAI_REGISTER } from '@app/contexts/constants'
import { ConfigurationService } from '@app/services'
import { sendTelemetryError } from '@app/utilities/node'

export default class ExtensionStatusBarItem {
  private static _instance: ExtensionStatusBarItem
  constructor(private statusBarItem: StatusBarItem) {}

  static init(context: ExtensionContext) {
    try {
      const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right)
      statusBarItem.name = 'vscode-openai'
      statusBarItem.command = VSCODE_OPENAI_REGISTER.SERVICE_COMMAND_ID
      statusBarItem.backgroundColor = new ThemeColor(
        'statusBarItem.errorBackground'
      )
      context.subscriptions.push(statusBarItem)
      ExtensionStatusBarItem._instance = new ExtensionStatusBarItem(
        statusBarItem
      )
    } catch (error) {
      sendTelemetryError(error)
    }
  }

  static get instance(): ExtensionStatusBarItem {
    return ExtensionStatusBarItem._instance
  }

  public async showStatusBarInformation(icon: string, text: string) {
    this.statusBarItem.text = `$(${icon}) ${ConfigurationService.instance.host} ${text}`
    this.statusBarItem.backgroundColor = undefined
    this.statusBarItem.show()
  }

  public async showStatusBarWarning(
    icon: string,
    text: string,
    hostname?: string
  ) {
    if (hostname === undefined) hostname = ConfigurationService.instance.host

    this.statusBarItem.text = `$(${icon}) ${hostname} ${text}`
    this.statusBarItem.backgroundColor = new ThemeColor(
      'statusBarItem.warningBackground'
    )
    this.statusBarItem.show()
  }

  public async showStatusBarError(
    icon: string,
    text: string,
    hostname?: string
  ) {
    if (hostname === undefined) hostname = ConfigurationService.instance.host

    this.statusBarItem.text = `$(${icon}) ${hostname} ${text}`
    this.statusBarItem.backgroundColor = new ThemeColor(
      'statusBarItem.errorBackground'
    )
    this.statusBarItem.show()
  }
}
