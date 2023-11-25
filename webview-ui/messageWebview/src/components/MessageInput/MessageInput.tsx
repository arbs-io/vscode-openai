import {
  Button,
  Textarea,
  ToggleButton,
  makeStyles,
} from '@fluentui/react-components'
import { Send16Regular, Mic24Regular, Mic24Filled } from '@fluentui/react-icons'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { IMessageInputProps } from '../../interfaces'

const useStyles = makeStyles({
  outerWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  textLayer: {
    height: 'auto',
  },
  hidden: {
    visibility: 'hidden',
  },
})

export const MessageInput: FC<IMessageInputProps> = (props) => {
  const { onSubmit } = props
  const [value, setValue] = useState<string>('')
  const [previousValue, setPreviousValue] = useState<string>('')
  const chatBottomRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (chatBottomRef.current) autoGrow(chatBottomRef.current)
  }, [value])

  const handleSubmitAudio = () => {}

  const handleSubmitText = (text: string) => {
    if (text.length < 5) return
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
  }

  const autoGrow = (element: HTMLTextAreaElement) => {
    element.style.height = '5px'
    element.style.height = element.scrollHeight + 'px'
  }

  const [audioOn, setAudioOn] = useState(false)
  const styles = useStyles()
  const toggleChecked = useCallback(() => {
    setAudioOn(!audioOn)
    if (audioOn) {
      handleSubmitAudio()
    }
  }, [audioOn])

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Textarea
        className={styles.textLayer}
        ref={chatBottomRef}
        style={{ width: '100%' }}
        placeholder="Type your message here. Press Shift+Enter for a new line. Press Ctrl+ArrowUp to restore previous message. Press Ctrl+F to search in the chat."
        value={value}
        onChange={(_e, d) => {
          setValue(d.value)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            handleSubmitText(value)
          } else if (event.key === 'ArrowUp' && event.ctrlKey) {
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
          onClick={() => toggleChecked()}
        />
        <Button
          appearance="transparent"
          icon={<Send16Regular />}
          onClick={() => {
            handleSubmitText(value)
          }}
        />
      </div>
    </div>
  )
}
