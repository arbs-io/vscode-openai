import ReactDOM from 'react-dom'
import { teamsDarkV2Theme, Provider } from '@fluentui/react-northstar'
import ChatExample from './components/MessageGrid'

ReactDOM.render(
  <Provider theme={teamsDarkV2Theme}>
    <ChatExample />
  </Provider>,
  document.getElementById('root')
)
