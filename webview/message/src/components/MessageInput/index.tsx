import { Button, Textarea, ToggleButton } from '@fluentui/react-components'
import { Send16Regular, Mic24Regular, Mic24Filled } from '@fluentui/react-icons'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { IMessageInputProps } from '@app/interfaces'
import { ConfigurationContext } from '@app/context'
import { useMessageInputStyles } from './styles/useMessageInputStyles'

export const MessageInput: FC<IMessageInputProps> = ({ onSubmit }) => {
  const [value, setValue] = useState<string>('')
  const [previousValue, setPreviousValue] = useState<string>('')
  const chatBottomRef = useRef<HTMLTextAreaElement>(null)
  const configuration = useContext(ConfigurationContext)

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.style.height = '5px'
      chatBottomRef.current.style.height = `${chatBottomRef.current.scrollHeight}px`
    }
  }, [value])

  const handleSubmitText = useCallback(
    (text: string) => {
      if (text.length < 1) return
      onSubmit({
        timestamp: new Date().toLocaleString(),
        mine: true,
        author: '',
        content: text.replace(/\n/g, '\n\n'),
        completionTokens: 0,
        promptTokens: 0,
        totalTokens: 0,
      })
      setPreviousValue(text)
      setValue('')
    },
    [onSubmit]
  )

  const [audioOn, setAudioOn] = useState(false)
  const messageInputStyles = useMessageInputStyles()

  const toggleChecked = useCallback(() => {
    setAudioOn((prevAudioOn) => !prevAudioOn)
  }, [])

  let placeholder =
    'Type your message here. Press Shift+Enter for a new line. Press Ctrl+ArrowUp to restore previous message. Press Ctrl+F to search in the chat.'
  let enableSC = true
  if (configuration?.messageShortcuts === 'false') {
    placeholder =
      'Input shortcuts are disabled, please use the send button only. Press Ctrl+F to search in the chat.'
    enableSC = false
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Textarea
        className={messageInputStyles.textLayer}
        ref={chatBottomRef}
        style={{ width: '100%' }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(event) => {
          if (enableSC && event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            handleSubmitText(value)
          } else if (enableSC && event.key === 'ArrowUp' && event.ctrlKey) {
            event.preventDefault()
            setValue(previousValue)
          }
        }}
      />
      <div className={messageInputStyles.outerWrapper}>
        <ToggleButton
          className={messageInputStyles.hidden}
          appearance="transparent"
          checked={audioOn}
          icon={audioOn ? <Mic24Filled /> : <Mic24Regular />}
          onClick={toggleChecked}
        />
        <Button
          appearance="transparent"
          icon={<Send16Regular />}
          onClick={() => handleSubmitText(value)}
        />
      </div>
    </div>
  )
}
