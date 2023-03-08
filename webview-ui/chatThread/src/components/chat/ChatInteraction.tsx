import {
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import React, { FC, useState } from 'react'
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
  const chatBottomRef = React.useRef<HTMLDivElement>(null)
  const [isBusy, setIsBusy] = useState<boolean>()
  const [chatHistory, setChatHistory] = useState<IChatMessage[]>(ChatThread)

  const styles = useStyles()

  React.useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [isBusy])

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
            setIsBusy(true)
            setChatHistory([...chatHistory, m])
            setIsBusy(false)
          }}
        />
      </div>
    </div>
  )
}

export default ChatInteraction
