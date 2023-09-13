import { useCallback, useEffect, useState } from 'react'
import ConversationGrid from './components/ConversationGrid/ConversationGrid'
import { IConversation } from './interfaces/IConversation'
import { vscode } from './utilities/vscode'
import { getTestConversation } from './testData'

function App() {
  const [didInitialize, setDidInitialize] = useState<boolean>(false)
  const [state, setState] = useState<MessageEvent>()

  const convs = getTestConversation()
  const [conversations, setConversations] = useState<IConversation[]>(convs)

  const onMessageReceivedFromIframe = useCallback(
    (event: MessageEvent) => {
      switch (event.data.command) {
        case 'onWillConversationsLoad': {
          const loadedConversations: IConversation[] = JSON.parse(
            event.data.text
          )
          console.log(`onWillConversationsLoad: ${loadedConversations.length}`)
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
      <ConversationGrid conversations={conversations} />
    </main>
  )
}

export default App
