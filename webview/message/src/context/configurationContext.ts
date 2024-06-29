import { tokens } from '@fluentui/react-components'
import React from 'react'
import { IContextConfiguration } from '@app/interfaces'

export function createContextConfiguration(): IContextConfiguration {
  const rootElement = document.getElementById('root') as HTMLElement
  const configuration: IContextConfiguration = {
    messageShortcuts: rootElement.getAttribute('messageShortcuts') ?? 'true',
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

export const ConfigurationContext =
  React.createContext<IContextConfiguration | null>(null)
