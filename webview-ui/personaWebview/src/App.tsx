import { useCallback, useEffect, useState } from 'react'
import PersonaGrid from './components/PersonaGrid/PersonaGrid'
import { IPersonaOpenAI } from './interfaces'
import { vscode } from './utilities/vscode'

function App() {
  const [didInitialize, setDidInitialize] = useState<boolean>(false)
  const [state, setState] = useState<MessageEvent>()
  const [personas, setPersonas] = useState<IPersonaOpenAI[]>([])

  const onMessageReceivedFromIframe = useCallback(
    (event: MessageEvent) => {
      switch (event.data.command) {
        case 'onWillPersonasLoad': {
          const loadedPersonas: IPersonaOpenAI[] = JSON.parse(event.data.text)
          setPersonas(loadedPersonas)
          break
        }
      }
      setState(event)
    },
    [state]
  )

  useEffect(() => {
    window.addEventListener('message', onMessageReceivedFromIframe)

    if (!didInitialize) {
      vscode.postMessage({
        command: 'onDidInitialize',
        text: undefined,
      })
      setDidInitialize(true)
    }

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
