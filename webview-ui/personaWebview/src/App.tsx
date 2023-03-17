import { useCallback, useEffect, useState } from 'react'
import PersonaGrid from './components/PersonaGrid/PersonaGrid'
import IPersonaOpenAI from 'interfaces/IPersonaOpenAI'

function App() {
  const [state, setState] = useState<MessageEvent>()
  const [personas, setPersonas] = useState<IPersonaOpenAI[]>([])

  const onMessageReceivedFromIframe = useCallback(
    (event: MessageEvent) => {
      switch (event.data.command) {
        case 'loadPersonas':
          // eslint-disable-next-line no-case-declarations
          const loadedPersonas: IPersonaOpenAI[] = JSON.parse(event.data.text)
          setPersonas(loadedPersonas)
          break
      }

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
      <PersonaGrid personas={personas} />
    </main>
  )
}

export default App
