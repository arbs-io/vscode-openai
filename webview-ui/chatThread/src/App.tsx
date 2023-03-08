import { makeStyles, mergeClasses } from '@fluentui/react-components'
import { FC, useState } from 'react'
import ChatInteraction from './components/chat/ChatInteraction'
import { IChatMessage } from './components/chat/ChatThread'

const useStyles = makeStyles({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
})

const App: FC = () => {
  const [chat, setChat] = useState<IChatMessage[]>()

  const styles = useStyles()

  return (
    <div className={mergeClasses(styles.container)}>
      <ChatInteraction
        uri="{process.env.REACT_APP_FUNCTION_URI as string}"
        onGetAISummary={(chat) => {
          setChat(chat)
        }}
        onBack={() => {
          /* placeholder */
        }}
      />
    </div>
  )
}

export default App
