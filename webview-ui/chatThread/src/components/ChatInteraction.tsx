import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components'
import { FC, useEffect, useRef, useState } from 'react'
import { ChatHistoryItem } from './ChatHistoryItem'
import { ChatInput } from './ChatInput'
import { ChatThread } from './ChatThread'
import { vscode } from '../utilities/vscode'
import { IChatMessage } from './IChatMessage'

const ChatInteraction: FC = () => {
  const chatBottomRef = useRef<HTMLDivElement>(null)
  const [chatHistory, setChatHistory] = useState<IChatMessage[]>(ChatThread)
  const [isBusy, setIsBusy] = useState<boolean>()

  const styles = useStyles()

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    // if (isBusy) {
    vscode.postMessage({
      command: 'saveMessages',
      text: JSON.stringify(chatHistory),
    })
    // }
  }, [chatHistory, isBusy])

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
