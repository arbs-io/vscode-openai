// import { useState } from 'react'
import ConversationGrid from './components/ConversationGrid/ConversationGrid'
// import { IConversation } from './interfaces/IConversation'
// import { getTestConversation } from './testConversation'

function App() {
  // const [conversations, setConversations] = useState<IConversation[]>([])

  // window.addEventListener('message', (event: MessageEvent) => {
  //   console.log(event.origin)
  //   if (!event.origin.startsWith('vscode-webview://')) return
  //   const message = event.data // The JSON data our extension sent
  //   switch (message.command) {
  //     case 'onWillConversationsLoad': {
  //       const rcvConversations: IConversation[] = JSON.parse(event.data.text)
  //       console.log(`onWillConversationsLoad::rcv ${rcvConversations.length}`)
  //       console.log(rcvConversations)
  //       setConversations(rcvConversations)
  //       console.log(`onWillConversationsLoad::set ${conversations.length}`)
  //       console.log(conversations)
  //       break
  //     }
  //   }
  // })

  return (
    <main>
      <ConversationGrid />
    </main>
  )
}

export default App
