import { useCallback, useEffect, useState } from 'react'
import ConversationGrid from './components/ConversationGrid/ConversationGrid'
import { IConversation } from './interfaces/IConversation'

function App() {
  const [state, setState] = useState<MessageEvent>()
  const [conversations, setConversations] = useState<IConversation[]>([])

  const onMessageReceivedFromIframe = useCallback(
    (event: MessageEvent) => {
      switch (event.data.command) {
        case 'rqstViewLoadConversations': {
          const loadedConversations: IConversation[] = JSON.parse(
            event.data.text
          )
          setConversations(loadedConversations)
          break
        }
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
      <ConversationGrid conversations={conversations} />
    </main>
  )
}

export default App
