import { FC } from 'react'
import {
  Pen16Regular,
  Notebook16Regular,
  CommentArrowRight16Regular,
} from '@fluentui/react-icons'
import { Caption1, makeStyles, shorthands } from '@fluentui/react-components'
import { IChatCompletionProps } from '@app/interfaces'

const useMessageItemTokenInfoStyles = makeStyles({
  container: {
    ...shorthands.gap('5px'),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'baseline',
  },
})

const MessageItemTokenInfo: FC<IChatCompletionProps> = ({ chatCompletion }) => {
  const styles = useMessageItemTokenInfoStyles()
  return (
    <div className={styles.container}>
      <Caption1>
        {<Pen16Regular />} Completion: {chatCompletion.completionTokens}
      </Caption1>
      <Caption1>
        {<Notebook16Regular />} Prompt: {chatCompletion.promptTokens}
      </Caption1>
      <Caption1>
        {<CommentArrowRight16Regular />} Total: {chatCompletion.totalTokens}
      </Caption1>
    </div>
  )
}

export default MessageItemTokenInfo
