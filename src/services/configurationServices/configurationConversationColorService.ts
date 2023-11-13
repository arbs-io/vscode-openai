import { window, ColorThemeKind } from 'vscode'
import { createErrorNotification, createInfoNotification } from '@app/apis/node'
import ConfigurationService from './configurationService'
import { IConfigurationConversationColor } from '@app/types'

export default class ConfigurationConversationColorService
  extends ConfigurationService
  implements IConfigurationConversationColor
{
  private static _instance: ConfigurationConversationColorService
  private readonly _cfg = 'conversation-configuration.colors.'
  static get instance(): ConfigurationConversationColorService {
    if (!this._instance) {
      try {
        this._instance = new ConfigurationConversationColorService()
      } catch (error) {
        createErrorNotification(error)
      }
    }
    return this._instance
  }

  public get userColor(): string {
    return this._isThemeDark()
      ? this.getConfigValue<string>(`${this._cfg}darkUserColor`)
      : this.getConfigValue<string>(`${this._cfg}lightUserColor`)
  }

  public get userBackground(): string {
    return this._isThemeDark()
      ? this.getConfigValue<string>(`${this._cfg}darkUserBackground`)
      : this.getConfigValue<string>(`${this._cfg}lightUserBackground`)
  }

  public get assistantColor(): string {
    return this._isThemeDark()
      ? this.getConfigValue<string>(`${this._cfg}darkAssistantColor`)
      : this.getConfigValue<string>(`${this._cfg}lightAssistantColor`)
  }

  public get assistantBackground(): string {
    return this._isThemeDark()
      ? this.getConfigValue<string>(`${this._cfg}darkAssistantBackground`)
      : this.getConfigValue<string>(`${this._cfg}lightAssistantBackground`)
  }

  private _isThemeDark() {
    return {
      [ColorThemeKind.Light]: false,
      [ColorThemeKind.Dark]: true,
      [ColorThemeKind.HighContrast]: true,
      [ColorThemeKind.HighContrastLight]: false,
    }[window.activeColorTheme.kind]
  }

  public static LogConfigurationService(): void {
    try {
      const cfg = this.instance
      const cfgMap = new Map<string, string>()
      cfgMap.set('userColor', cfg.userColor)
      cfgMap.set('userBackground', cfg.userBackground)
      cfgMap.set('assistantColor', cfg.assistantColor)
      cfgMap.set('assistantBackground', cfg.assistantBackground)

      createInfoNotification(Object.fromEntries(cfgMap), 'conversation_color')
    } catch (error) {
      createErrorNotification(error)
    }
  }
}
