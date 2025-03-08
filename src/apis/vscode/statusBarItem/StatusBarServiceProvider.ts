import {
  ExtensionContext,
  StatusBarAlignment,
  StatusBarItem,
  ThemeColor,
  window,
} from 'vscode';
import { SettingConfig as settingCfg } from '@app/services';
import { createErrorNotification } from '@app/apis/node';

export default class StatusBarServiceProvider {
  private static _instance: StatusBarServiceProvider;
  constructor(private statusBarItem: StatusBarItem) {}

  static init(context: ExtensionContext) {
    try {
      const statusBarItem = window.createStatusBarItem(
        StatusBarAlignment.Right,
        102
      );
      statusBarItem.name = 'vscode-openai';
      statusBarItem.command = 'vscode-openai.configuration.show.quickpick';
      statusBarItem.backgroundColor = new ThemeColor(
        'statusBarItem.errorBackground'
      );
      context.subscriptions.push(statusBarItem);
      StatusBarServiceProvider._instance = new StatusBarServiceProvider(
        statusBarItem
      );
    } catch (error) {
      createErrorNotification(error);
    }
  }

  static get instance(): StatusBarServiceProvider {
    return StatusBarServiceProvider._instance;
  }

  public async showStatusBarInformation(
    icon: string = 'vscode-openai',
    text: string = ''
  ) {
    this.statusBarItem.text = `$(${icon}) ${settingCfg.host} ${text}`;
    this.statusBarItem.backgroundColor = undefined;
    this.statusBarItem.show();
  }

  public async showStatusBarWarning(
    icon: string,
    text: string,
    hostname?: string
  ) {
    if (hostname === undefined) {hostname = settingCfg.host;}

    this.statusBarItem.text = `$(${icon}) ${hostname} ${text}`;
    this.statusBarItem.backgroundColor = new ThemeColor(
      'statusBarItem.warningBackground'
    );
    this.statusBarItem.show();
  }

  public async showStatusBarError(
    icon: string,
    text: string,
    hostname?: string
  ) {
    if (hostname === undefined) {hostname = settingCfg.host;}

    this.statusBarItem.text = `$(${icon}) ${hostname} ${text}`;
    this.statusBarItem.backgroundColor = new ThemeColor(
      'statusBarItem.errorBackground'
    );
    this.statusBarItem.show();
  }
}
