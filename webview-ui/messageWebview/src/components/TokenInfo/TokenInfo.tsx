import {
  makeStyles,
  Button,
  Popover,
  PopoverTrigger,
  PopoverSurface,
  shorthands,
  Caption1,
} from '@fluentui/react-components'
import {
  Info16Regular,
  Pen16Regular,
  Notebook16Regular,
  CommentArrowRight16Regular,
} from '@fluentui/react-icons'
import { ITokenInfoProps } from '../../interfaces'
import { FC } from 'react'

const useStyles = makeStyles({
  container: {
    ...shorthands.gap('5px'),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'baseline',
  },
  infoButton: {
    float: 'right',
  },
})
const TokenPopover: FC<ITokenInfoProps> = ({ message }) => {
  const styles = useStyles()
  return (
    <div className={styles.container}>
      <Caption1>
        {<Pen16Regular />} Completion: {message.completionTokens}
      </Caption1>
      <Caption1>
        {<Notebook16Regular />} Prompt: {message.promptTokens}
      </Caption1>
      <Caption1>
        {<CommentArrowRight16Regular />} Total: {message.totalTokens}
      </Caption1>
    </div>
  )
}
export const TokenInfo: FC<ITokenInfoProps> = ({ message }) => {
  const styles = useStyles()
  return (
    <span className={styles.infoButton}>
      <Popover withArrow>
        <PopoverTrigger disableButtonEnhancement>
          <Button
            appearance="transparent"
            size="small"
            icon={<Info16Regular />}
          />
        </PopoverTrigger>

        <PopoverSurface>
          <TokenPopover message={message} />
        </PopoverSurface>
      </Popover>
    </span>
  )
}

export default TokenInfo
