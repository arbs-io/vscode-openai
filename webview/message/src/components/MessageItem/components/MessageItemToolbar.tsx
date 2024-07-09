import { FC, MouseEvent } from 'react'
import {
  makeStyles,
  Button,
  Popover,
  PopoverTrigger,
  PopoverSurface,
} from '@fluentui/react-components'
import { Info16Regular, Speaker216Regular } from '@fluentui/react-icons'
import { IChatCompletionProps } from '@app/interfaces'
import { TextToSpeech } from '@app/utilities'
import { MessageItemTokenInfo } from '.'

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

const MessageItemToolbar: FC<IChatCompletionProps> = ({ chatCompletion }) => {
  const styles = useMessageItemToolbarStyles()
  return (
    <span className={styles.infoButton}>
      <Button
        appearance="transparent"
        size="small"
        icon={<Speaker216Regular />}
        onClick={(e) => handleSpeech(e, chatCompletion.content)}
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
          <MessageItemTokenInfo chatCompletion={chatCompletion} />
        </PopoverSurface>
      </Popover>
    </span>
  )
}

export default MessageItemToolbar
