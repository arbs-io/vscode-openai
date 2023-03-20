import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components'
import { FC, useEffect, useRef, useState } from 'react'
import { MessageHistory } from './MessageHistory'
import { MessageInput } from './MessageInput'
import { vscode } from '../utilities/vscode'
import { IChatMessage } from '../interfaces/IChatMessage'

const MessageInteraction: FC = () => {
  const chatBottomRef = useRef<HTMLDivElement>(null)
  const [chatHistory, setChatHistory] = useState<IChatMessage[]>([])
  const [forceRefresh, setForceRefresh] = useState<boolean>()
  const [isNew, setIsNew] = useState<boolean>(false)

  const styles = useStyles()

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (chatHistory.length > 0) {
      vscode.postMessage({
        command: 'rcvdViewSaveMessages',
        text: JSON.stringify(chatHistory),
      })
    }
  }, [chatHistory, forceRefresh])

  window.addEventListener('message', (event) => {
    const message = event.data // The JSON data our extension sent
    switch (message.command) {
      case 'rqstViewRenderMessages':
        // eslint-disable-next-line no-case-declarations
        const chatMessages: IChatMessage[] = JSON.parse(message.text)
        setChatHistory(chatMessages)
        setIsNew(chatMessages.length <= 1 ? true : false)
        break

      case 'rqstViewAnswerMessage':
        // eslint-disable-next-line no-case-declarations
        const chatMessage: IChatMessage = JSON.parse(message.text)
        chatHistory.push(chatMessage)
        setForceRefresh(!forceRefresh)
        break
    }
  })

  return (
    <div className={mergeClasses(styles.container)}>
      <div className={mergeClasses(styles.history)}>
        {chatHistory.map((m, idx) => (
          <MessageHistory key={idx} message={m} />
        ))}
        <div ref={chatBottomRef} />
      </div>
      <div hidden={!isNew} className={mergeClasses(styles.input)}>
        <MessageInput
          disableInput={!isNew}
          onSubmit={(m) => {
            setChatHistory([...chatHistory, m])
          }}
        />
      </div>
    </div>
  )
}
export default MessageInteraction

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '5px',
  },
  history: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '5px',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingBottom: '3rem',
    // backgroundColor: tokens.colorNeutralBackground1,
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
    // backgroundColor: tokens.colorNeutralBackground1,
  },
})
