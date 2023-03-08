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
  example: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyItems: 'center',
    minHeight: '96px',
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
      <div
        style={{
          gridArea: 'content',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '1rem 0',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {chatHistory.map((m, idx) => (
            <ChatHistoryItem key={idx} message={m} />
          ))}
          <div ref={chatBottomRef} />
        </div>
      </div>
      <div
        style={{
          gridArea: 'footer',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1rem',

          // borderTop: '1px solid #ccc',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <ChatInput
            onSubmit={(m) => {
              setIsBusy(true)
              setChatHistory([...chatHistory, m])
              setIsBusy(false)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ChatInteraction
