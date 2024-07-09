import { FC } from 'react'
import {
  Pen16Regular,
  Notebook16Regular,
  CommentArrowRight16Regular,
} from '@fluentui/react-icons'
import { Caption1, makeStyles, shorthands } from '@fluentui/react-components'
import { IMessageUtilityProps } from '@app/interfaces'

export const useTokenPopoverStyles = makeStyles({
  container: {
    ...shorthands.gap('5px'),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'baseline',
  },
})

const TokenPopover: FC<IMessageUtilityProps> = ({ message }) => {
  const styles = useTokenPopoverStyles()
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

export default TokenPopover
