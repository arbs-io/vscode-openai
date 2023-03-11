import { useCallback, useEffect, useState } from 'react'
import { Default as PersonaGrid } from './components/PersonaGrid'

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
      <PersonaGrid />
    </main>
  )
}

export default App
