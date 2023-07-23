import { makeStyles, mergeClasses } from '@fluentui/react-components'
import { FC, useEffect, useRef, useState } from 'react'
import { MessageHistory } from '../MessageHistory'
import { MessageInput } from '../MessageInput'
import { vscode } from '../../utilities/vscode'
import { IChatCompletion } from '../../interfaces/IChatCompletion'

const MessageInteraction: FC = () => {
  const bottomAnchorRef = useRef<HTMLDivElement>(null)
  const [chatHistory, setChatHistory] = useState<IChatCompletion[]>([])
  const [autoSaveThreshold, setAutoSaveThreshold] = useState<number>(0)
  const [forceRefresh, setForceRefresh] = useState<boolean>()
  const messageStyles = useMessageStyles()

  useEffect(() => {
    bottomAnchorRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (chatHistory.length > autoSaveThreshold) {
      vscode.postMessage({
        command: 'onDidSaveMessages',
        text: JSON.stringify(chatHistory),
      })
    }
  }, [chatHistory, forceRefresh])

  window.addEventListener('message', (event) => {
    console.log(event.origin)
    if (!event.origin.startsWith('vscode-webview://')) return

    const message = event.data // The JSON data our extension sent
    switch (message.command) {
      case 'onWillRenderMessages': {
        const chatMessages: IChatCompletion[] = JSON.parse(message.text)
        setAutoSaveThreshold(chatMessages.length)
        setChatHistory(chatMessages)
        break
      }

      case 'onWillAnswerMessage': {
        const chatMessage: IChatCompletion = JSON.parse(message.text)
        chatHistory.push(chatMessage)
        setForceRefresh(!forceRefresh)
        break
      }
    }
  })

  return (
    <div className={mergeClasses(messageStyles.container)}>
      <div className={mergeClasses(messageStyles.history)}>
        {chatHistory.map((m, idx) => (
          <MessageHistory key={idx} message={m} />
        ))}
        <div ref={bottomAnchorRef} />
      </div>
      <div className={mergeClasses(messageStyles.input)}>
        <MessageInput
          onSubmit={(m) => {
            setChatHistory([...chatHistory, m])
          }}
        />
      </div>
    </div>
  )
}
export default MessageInteraction

const useMessageStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    width: 'auto',
    height: 'auto',
  },
  history: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    rowGap: '2px',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingBottom: '7rem',
    overflowY: 'auto',
  },
  input: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: '2rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingTop: '2rem',
  },
})
