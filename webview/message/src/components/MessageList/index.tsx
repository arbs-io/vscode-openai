import { Field, ProgressBar, mergeClasses } from '@fluentui/react-components'
import { FC, useEffect, useRef, useState, useCallback } from 'react'
import { MessageItem } from '@app/components/MessageItem'
import { MessageInput } from '@app/components/MessageInput'
import { vscode } from '@app/utilities'
import { IChatCompletion } from '@app/interfaces'
import { useMessageListStyles } from './styles/useMessageListStyles'
import { WelcomeMessageBar } from './components/WelcomeMessageBar'

export const MessageList: FC = () => {
  const bottomAnchorRef = useRef<HTMLDivElement>(null)
  const [chatCompletionList, setChatCompletionList] = useState<
    IChatCompletion[]
  >([])
  const [autoSaveThreshold, setAutoSaveThreshold] = useState<number>(0)
  const [showField, setShowField] = useState(false)
  const messageListStyles = useMessageListStyles()

  useEffect(() => {
    bottomAnchorRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (chatCompletionList.length > autoSaveThreshold) {
      vscode.postMessage({
        command: 'onDidSaveMessages',
        text: JSON.stringify(chatCompletionList),
      })
    }
  }, [chatCompletionList, autoSaveThreshold])

  const handleMessageEvent = useCallback((event: MessageEvent) => {
    if (!event.origin.startsWith('vscode-webview://')) return

    const message = event.data
    switch (message.command) {
      case 'onWillRenderMessages': {
        const chatMessages: IChatCompletion[] = JSON.parse(message.text)
        setAutoSaveThreshold(chatMessages.length)
        setChatCompletionList(chatMessages)
        break
      }

      case 'onWillAnswerMessage': {
        const chatMessage: IChatCompletion = JSON.parse(message.text)
        setChatCompletionList((prevHistory) => [...prevHistory, chatMessage])
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
      <WelcomeMessageBar chatCompletionList={chatCompletionList} />
      <div className={mergeClasses(messageListStyles.history)}>
        {chatCompletionList.map((chatCompletion) => (
          <MessageItem
            key={chatCompletion.timestamp}
            chatCompletion={chatCompletion}
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
            setChatCompletionList((prevHistory) => [...prevHistory, m])
          }}
        />
      </div>
    </div>
  )
}
