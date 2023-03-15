import { Button, Input } from '@fluentui/react-components'
import { Send16Regular } from '@fluentui/react-icons'
import React, { FC } from 'react'
import { vscode } from '../utilities/vscode'
import { IChatMessage } from '../interfaces/IChatMessage'

interface MessageInputProps {
  onSubmit: (message: IChatMessage) => void
  disableInput: boolean
}

export const MessageInput: FC<MessageInputProps> = (props) => {
  const { onSubmit, disableInput } = props
  const [value, setValue] = React.useState<string>('')
  const [previousValue, setPreviousValue] = React.useState<string>('')

  const handleSubmit = (text: string) => {
    onSubmit({
      timestamp: new Date().toLocaleString(),
      mine: true,
      author: '',
      content: text,
    })
    setPreviousValue(text)
    setValue('')

    vscode.postMessage({
      command: 'newChatThreadQuestion',
      text: text,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
      <Input
        disabled={disableInput}
        style={{ width: '100%' }}
        placeholder="Type your message here"
        value={value}
        multiple
        onChange={(e, d) => setValue(d.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            handleSubmit(value)
          } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            setValue(previousValue)
          }
        }}
      />
      <Button
        disabled={disableInput}
        appearance="transparent"
        icon={<Send16Regular />}
        onClick={() => handleSubmit(value)}
      />
    </div>
  )
}
