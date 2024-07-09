import { Field, ProgressBar, mergeClasses } from '@fluentui/react-components'
import { FC, useEffect, useRef, useState, useCallback } from 'react'
import { MessageItem } from '@app/components/MessageItem'
import { MessageInput } from '@app/components/MessageInput'
import { vscode } from '@app/utilities'
import { IChatCompletion } from '@app/interfaces'
import { useMessageListStyles } from './styles/useMessageListStyles'

export const MessageList: FC = () => {
  const bottomAnchorRef = useRef<HTMLDivElement>(null)
  const [chatHistory, setChatHistory] = useState<IChatCompletion[]>([])
  const [autoSaveThreshold, setAutoSaveThreshold] = useState<number>(0)
  const [showField, setShowField] = useState(false)
  const messageListStyles = useMessageListStyles()

  useEffect(() => {
    bottomAnchorRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (chatHistory.length > autoSaveThreshold) {
      vscode.postMessage({
        command: 'onDidSaveMessages',
        text: JSON.stringify(chatHistory),
      })
    }
  }, [chatHistory, autoSaveThreshold])

  const handleMessageEvent = useCallback((event: MessageEvent) => {
    if (!event.origin.startsWith('vscode-webview://')) return

    const message = event.data
    switch (message.command) {
      case 'onWillRenderMessages': {
        const chatMessages: IChatCompletion[] = JSON.parse(message.text)
        setAutoSaveThreshold(chatMessages.length)
        setChatHistory(chatMessages)
        break
      }

      case 'onWillAnswerMessage': {
        const chatMessage: IChatCompletion = JSON.parse(message.text)
        setChatHistory((prevHistory) => [...prevHistory, chatMessage])
        setShowField(false)
        break
      }
    }
  }, [])

  useEffect(() => {
    window.addEventListener('message', handleMessageEvent)
    return () => {
      window.removeEventListener('message', handleMessageEvent)
    }
  }, [handleMessageEvent])

  return (
    <div className={mergeClasses(messageListStyles.container)}>
      <div className={mergeClasses(messageListStyles.history)}>
        {chatHistory.map((chatCompletion) => (
          <MessageItem
            key={chatCompletion.timestamp}
            message={chatCompletion}
          />
        ))}
        <div ref={bottomAnchorRef} />
      </div>

      <div className={mergeClasses(messageListStyles.input)}>
        {showField && (
          <Field
            validationMessage="waiting for response"
            validationState="warning"
          >
            <ProgressBar />
          </Field>
        )}
        <MessageInput
          onSubmit={(m) => {
            setShowField(true)
            setChatHistory((prevHistory) => [...prevHistory, m])
          }}
        />
      </div>
    </div>
  )
}
