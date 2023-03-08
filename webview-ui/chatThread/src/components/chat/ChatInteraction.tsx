import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components'
import { FC, useEffect, useRef, useState } from 'react'
import { ChatHistoryItem } from './ChatHistoryItem'
import { ChatInput } from './ChatInput'
import { ChatThread, IChatMessage } from './ChatThread'

interface IData {
  uri: string
  onGetAISummary: (chat: IChatMessage[]) => void
  onBack: () => void
}

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '5px',
  },
  history: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '20px',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingBottom: '3rem',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  input: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: '1rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingTop: '1rem',
    backgroundColor: tokens.colorNeutralBackground1,
  },
})

const ChatInteraction: FC<IData> = ({ uri, onGetAISummary, onBack }) => {
  const chatBottomRef = useRef<HTMLDivElement>(null)
  const [chatHistory, setChatHistory] = useState<IChatMessage[]>(ChatThread)

  const styles = useStyles()

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  return (
    <div className={mergeClasses(styles.container)}>
      <div className={mergeClasses(styles.history)}>
        {chatHistory.map((m, idx) => (
          <ChatHistoryItem key={idx} message={m} />
        ))}
        <div ref={chatBottomRef} />
      </div>
      <div className={mergeClasses(styles.input)}>
        <ChatInput
          onSubmit={(m) => {
            setChatHistory([...chatHistory, m])
          }}
        />
      </div>
    </div>
  )
}

export default ChatInteraction
