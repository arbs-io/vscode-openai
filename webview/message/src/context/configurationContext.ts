import { IContextConfiguration } from '@app/interfaces';
import { tokens } from '@fluentui/react-components';
import React from 'react';

export function createContextConfiguration(): IContextConfiguration {
  const rootElement = document.getElementById('root') as HTMLElement;
  const configuration: IContextConfiguration = {
    messageShortcuts: rootElement.getAttribute('messageShortcuts') ?? 'true',
    assistantColor: tokens.colorPaletteBlueForeground2,
    assistantBackground: tokens.colorPaletteBlueBackground2,
    userColor: tokens.colorNeutralForeground3Hover,
    userBackground: tokens.colorNeutralBackground4,
  };
  return configuration;
}

export const ConfigurationContext =
  React.createContext<IContextConfiguration | null>(null);
