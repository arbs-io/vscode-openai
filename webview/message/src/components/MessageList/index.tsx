import { MessageInput } from '@app/components/MessageInput';
import { MessageItem } from '@app/components/MessageItem';
import { IChatCompletion } from '@app/interfaces';
import { vscode } from '@app/utilities';
import { Field, ProgressBar, mergeClasses } from '@fluentui/react-components';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { WelcomeMessageBar } from './components/WelcomeMessageBar';
import { useMessageListStyles } from './styles/useMessageListStyles';

export const MessageList: FC = () => {
  const bottomAnchorRef = useRef<HTMLDivElement>(null)
  const [chatCompletionList, setChatCompletionList] = useState<
    IChatCompletion[]
  >([])
  const [autoSaveThreshold, setAutoSaveThreshold] = useState<number>(0)
  const [showField, setShowField] = useState(false)
  const messageListStyles = useMessageListStyles()

  // Scroll to the bottom when messages change or component mounts
  useEffect(() => {
    bottomAnchorRef.current?.scrollIntoView({ behavior: 'smooth' })

    if (chatCompletionList.length > autoSaveThreshold) {
      vscode.postMessage({
        command: 'onDidSaveMessages',
        text: JSON.stringify(chatCompletionList),
      })
    }
  }, [chatCompletionList, autoSaveThreshold])

  // Handle incoming messages from the extension
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
        setChatCompletionList((prevList) => [...prevList, chatMessage])
        setShowField(false)
        break
      }

      case 'onWillAnswerMessageStream': {
        const chatMessage: string = message.text

        setChatCompletionList((prevList) => {
          const updatedList = [...prevList]
          const lastItemIndex = updatedList.length - 1

          // User never streams, must have been something wrong
          if (updatedList[lastItemIndex].mine) { 
            console.warn('Attempted to write to the user input.');
            return prevList;
          }

          // Check if there are existing messages to append the stream to
          if (lastItemIndex >= 0) {
            const lastItem = updatedList[lastItemIndex]
            lastItem.content += chatMessage // Append the stream to the last message
            updatedList[lastItemIndex] = lastItem // Update the last item
          } else {
            console.warn(
              'No existing messages to update with the streaming content.'
            )
          }

          return updatedList
        })
        setShowField(false)
        break
      }
    }
  }, [])

  // Add event listener for incoming messages
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
            key={chatCompletion.timestamp} // Ensure timestamp is unique
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
            setChatCompletionList((prevList) => [...prevList, m]) // Append the new message
          }}
        />
      </div>
    </div>
  )
}
