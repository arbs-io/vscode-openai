import ReactDOM from 'react-dom'
import {
  FluentProvider,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components'
import App from './App'

ReactDOM.render(
  <FluentProvider theme={webDarkTheme}>
    <App />
  </FluentProvider>,
  document.getElementById('root')
)
