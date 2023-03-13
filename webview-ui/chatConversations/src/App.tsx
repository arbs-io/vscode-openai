import { useCallback, useEffect, useState } from 'react'
import { Default as ConversationGrid } from './components/ConversationGrid'
function App() {
  const [state, setState] = useState<MessageEvent>()

  const onMessageReceivedFromIframe = useCallback(
    (event: MessageEvent) => {
      console.log('chatPersona::onMessageReceivedFromIframe', event)
      // switch (event.data.command) {
      //   case 'loadPersonas':
      //     // eslint-disable-next-line no-case-declarations
      //     const loadedPersonas: IPersonaOpenAI[] = JSON.parse(event.data.text)
      //     console.log(`PersonaGrid::loadedPersonas ${loadedPersonas.length}`)
      //     setPersonas(loadedPersonas)
      //     break
      // }

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
      <ConversationGrid />
    </main>
  )
}

export default App
