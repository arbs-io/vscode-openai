import { IChatCompletionProps } from '@app/interfaces';
import { Caption1, makeStyles, shorthands } from '@fluentui/react-components';
import {
  CommentArrowRight16Regular,
  Notebook16Regular,
  Pen16Regular,
} from '@fluentui/react-icons';
import { FC } from 'react';

const useMessageItemTokenInfoStyles = makeStyles({
  container: {
    ...shorthands.gap('8px'),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    fontSize: '0.875rem',
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
