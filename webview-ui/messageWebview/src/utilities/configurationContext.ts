import { tokens } from '@fluentui/react-components'
import React from 'react'
import { IConfiguration } from '../interfaces'

export function getConfigurationDefaults(): IConfiguration {
  const rootElement = document.getElementById('root') as HTMLElement
  const configuration: IConfiguration = {
    assistantColor:
      rootElement.getAttribute('assistantColor') ??
      tokens.colorPaletteGreenForeground3,
    assistantBackground:
      rootElement.getAttribute('assistantBackground') ??
      tokens.colorPaletteGreenBackground1,
    userColor:
      rootElement.getAttribute('userColor') ??
      tokens.colorNeutralForeground3Hover,
    userBackground:
      rootElement.getAttribute('userBackground') ??
      tokens.colorNeutralBackground4,
  }
  return configuration
}

export const ConfigurationContext = React.createContext<IConfiguration | null>(
  null
)
