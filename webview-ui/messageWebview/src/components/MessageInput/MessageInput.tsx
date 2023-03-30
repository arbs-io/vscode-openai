import { Button, Textarea } from '@fluentui/react-components'
import { Send16Regular } from '@fluentui/react-icons'
import { FC, useRef, useState } from 'react'
import { IChatMessage } from '../../interfaces/IChatMessage'

interface MessageInputProps {
  onSubmit: (message: IChatMessage) => void
}

export const MessageInput: FC<MessageInputProps> = (props) => {
  const { onSubmit } = props
  const [value, setValue] = useState<string>('')
  const [previousValue, setPreviousValue] = useState<string>('')
  const chatBottomRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (text: string) => {
    onSubmit({
      timestamp: new Date().toLocaleString(),
      mine: true,
      author: '',
      content: text,
    })
    setPreviousValue(text)
    setValue('')
  }

  const autoGrow = (element: HTMLTextAreaElement) => {
    element.style.height = '2px'
    element.style.height = element.scrollHeight + 'px'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
      <Textarea
        ref={chatBottomRef}
        style={{ width: '100%' }}
        placeholder="Type your message here..."
        appearance="filled-lighter-shadow"
        value={value}
        onInput={(e) => {
          if (chatBottomRef.current) autoGrow(chatBottomRef.current)
        }}
        onChange={(e, d) => {
          setValue(d.value)
          autoGrow(e.target)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            handleSubmit(value)
            autoGrow(event.currentTarget)
          } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            setValue(previousValue)
          }
        }}
      />

      <Button
        appearance="transparent"
        icon={<Send16Regular />}
        onClick={() => {
          handleSubmit(value)
          if (chatBottomRef.current) autoGrow(chatBottomRef.current)
        }}
      />
    </div>
  )
}
