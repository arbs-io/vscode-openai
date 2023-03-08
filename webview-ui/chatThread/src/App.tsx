import { FC, useState } from 'react'
import ChatInteraction from './components/chat/ChatInteraction'
import { IChatMessage } from './components/chat/ChatThread'

const App: FC = () => {
  const [chat, setChat] = useState<IChatMessage[]>()

  return (
    <main>
      <ChatInteraction
        uri="{process.env.REACT_APP_FUNCTION_URI as string}"
        onGetAISummary={(chat) => {
          setChat(chat)
        }}
        onBack={() => {
          /* placeholder */
        }}
      />
    </main>
  )
}

export default App
