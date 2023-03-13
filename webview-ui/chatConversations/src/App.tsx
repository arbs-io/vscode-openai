import { useCallback, useEffect, useState } from 'react'
import ConversationGrid from './components/ConversationGrid'
import { IConversation } from '@appInterfaces/IConversation'

function App() {
  const [state, setState] = useState<MessageEvent>()
  const [conversations, setConversations] = useState<IConversation[]>([])

  const onMessageReceivedFromIframe = useCallback(
    (event: MessageEvent) => {
      console.log('chatPersona::onMessageReceivedFromIframe', event)
      switch (event.data.command) {
        case 'loadConversations':
          // eslint-disable-next-line no-case-declarations
          const loadedConversations: IConversation[] = JSON.parse(
            event.data.text
          )
          console.log(
            `chatConversations::loadedConversations ${loadedConversations.length}`
          )
          setConversations(loadedConversations)
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
      <ConversationGrid conversations={conversations} />
    </main>
  )
}

export default App
