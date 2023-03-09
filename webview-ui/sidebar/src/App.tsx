import { useCallback, useEffect, useState } from 'react'
import { Default as MessageGrid } from './components/MessageGrid'
import { Default as GridToolbar } from './components/PersonaToolbar'
function App() {
  const [state, setState] = useState<MessageEvent>()
  const onMessageReceivedFromIframe = useCallback(
    (event: MessageEvent) => {
      console.log('onMessageReceivedFromIframe', event)
      setState(event)
    },
    [state]
  )

  useEffect(() => {
    window.addEventListener('message', onMessageReceivedFromIframe)
    return () =>
      window.removeEventListener('message', onMessageReceivedFromIframe)
  }, [onMessageReceivedFromIframe])

  return (
    <main>
      <GridToolbar />
      <MessageGrid />
    </main>
  )
}

export default App
