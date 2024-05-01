import {
  Button,
  Textarea,
  ToggleButton,
  makeStyles,
} from '@fluentui/react-components'
import { Send16Regular, Mic24Regular, Mic24Filled } from '@fluentui/react-icons'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { IMessageInputProps } from '../../interfaces'
import { ConfigurationContext } from '../../utilities'

const useStyles = makeStyles({
  outerWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  textLayer: {
    height: '100%',
  },
  hidden: {
    visibility: 'hidden',
  },
})

export const MessageInput: FC<IMessageInputProps> = ({ onSubmit }) => {
  const [value, setValue] = useState<string>('')
  const [previousValue, setPreviousValue] = useState<string>('')
  const chatBottomRef = useRef<HTMLTextAreaElement>(null)
  const configuration = useContext(ConfigurationContext)

  useEffect(() => {
    if (!configuration) {
      throw new Error('Invalid ConfigurationContext')
    }
  }, [configuration])

  useEffect(() => {
    if (chatBottomRef.current) {
      autoGrow(chatBottomRef.current)
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

  const autoGrow = (element: HTMLTextAreaElement) => {
    element.style.height = '5px'
    element.style.height = `${element.scrollHeight}px`
  }

  const [audioOn, setAudioOn] = useState(false)
  const styles = useStyles()

  const toggleChecked = useCallback(() => {
    setAudioOn((prevAudioOn) => {
      const newAudioState = !prevAudioOn
      if (newAudioState) {
        // Implement necessary actions when audio is turned on
      }
      return newAudioState
    })
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
        className={styles.textLayer}
        ref={chatBottomRef}
        style={{ width: '100%' }}
        placeholder={placeholder}
        value={value}
        onChange={(_e, d) => setValue(d.value)}
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
      <div className={styles.outerWrapper}>
        <ToggleButton
          className={styles.hidden}
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
