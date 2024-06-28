import {
  webDarkTheme,
  webLightTheme,
  FluentProvider,
} from '@fluentui/react-components'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeContext, createContextTheme } from './context'

const ele = document.getElementById('root') as HTMLElement
const isDarkMode = ele.getAttribute('theme') === 'dark'
const themeFluentUI = isDarkMode ? webDarkTheme : webLightTheme
const root = ReactDOM.createRoot(ele)

root.render(
  <React.StrictMode>
    <ThemeContext.Provider value={createContextTheme(isDarkMode)}>
      <FluentProvider theme={themeFluentUI}>
        <App />
      </FluentProvider>
    </ThemeContext.Provider>
  </React.StrictMode>
)
