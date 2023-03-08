import {
  webDarkTheme,
  webLightTheme,
  FluentProvider,
} from '@fluentui/react-components'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const rootElement = document.getElementById('root') as HTMLElement
const theme =
  rootElement.getAttribute('theme') === 'dark' ? webDarkTheme : webLightTheme
const root = ReactDOM.createRoot(rootElement)

root.render(
  <React.StrictMode>
    <FluentProvider theme={theme}>
      <App />
    </FluentProvider>
  </React.StrictMode>
)
