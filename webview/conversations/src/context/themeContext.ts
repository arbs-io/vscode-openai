import React from 'react'
import { IContextTheme } from '@app/interfaces'

export function createContextTheme(isDarkMode: boolean): IContextTheme {
  const configuration: IContextTheme = {
    isDarkMode: isDarkMode,
  }
  return configuration
}

export const ThemeContext = React.createContext<IContextTheme | null>(null)
