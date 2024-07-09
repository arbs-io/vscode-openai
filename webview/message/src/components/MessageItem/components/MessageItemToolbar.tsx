import { FC, MouseEvent } from 'react'
import {
  makeStyles,
  Button,
  Popover,
  PopoverTrigger,
  PopoverSurface,
} from '@fluentui/react-components'
import { Info16Regular, Speaker216Regular } from '@fluentui/react-icons'
import { IMessageUtilityProps } from '@app/interfaces'
import { TextToSpeech } from '@app/utilities'
import MessageItemTokenInfo from './MessageItemTokenInfo'

const handleSpeech = (
  _e: MouseEvent<HTMLButtonElement>,
  speechText: string
) => {
  const textToSpeech = TextToSpeech.getInstance()
  textToSpeech.activateTextToSpeech(speechText)
}

const useMessageItemToolbarStyles = makeStyles({
  infoButton: {
    float: 'right',
  },
})

const MessageItemToolbar: FC<IMessageUtilityProps> = ({ message }) => {
  const styles = useMessageItemToolbarStyles()
  return (
    <span className={styles.infoButton}>
      <Button
        appearance="transparent"
        size="small"
        icon={<Speaker216Regular />}
        onClick={(e) => handleSpeech(e, message.content)}
      />
      <Popover withArrow>
        <PopoverTrigger disableButtonEnhancement>
          <Button
            appearance="transparent"
            size="small"
            icon={<Info16Regular />}
          />
        </PopoverTrigger>

        <PopoverSurface>
          <MessageItemTokenInfo message={message} />
        </PopoverSurface>
      </Popover>
    </span>
  )
}

export default MessageItemToolbar
