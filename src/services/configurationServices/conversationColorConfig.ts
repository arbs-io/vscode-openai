import { window, ColorThemeKind } from 'vscode'
import { createErrorNotification, createInfoNotification } from '@app/apis/node'
import ConfigValue from './utilities/configValue'
import { IConfigurationConversationColor } from '@app/interfaces'

class ConversationColorConfig
  extends ConfigValue
  implements IConfigurationConversationColor
{
  private readonly _cfg = 'conversation-configuration.colors.'
  private static instance: ConversationColorConfig | null = null

  public static getInstance(): ConversationColorConfig {
    if (!ConversationColorConfig.instance) {
      ConversationColorConfig.instance = new ConversationColorConfig()
    }
    return ConversationColorConfig.instance
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

  public log(): void {
    try {
      const cfgMap = new Map<string, string>()
      cfgMap.set('userColor', this.userColor)
      cfgMap.set('userBackground', this.userBackground)
      cfgMap.set('assistantColor', this.assistantColor)
      cfgMap.set('assistantBackground', this.assistantBackground)

      createInfoNotification(Object.fromEntries(cfgMap), 'conversation_color')
    } catch (error) {
      createErrorNotification(error)
    }
  }
}
export default ConversationColorConfig.getInstance()
