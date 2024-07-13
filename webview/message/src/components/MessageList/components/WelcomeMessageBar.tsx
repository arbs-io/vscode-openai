import * as React from 'react'
import {
  MessageBar,
  MessageBarTitle,
  MessageBarBody,
  MessageBarGroup,
  Link,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import { IChatCompletionListProps } from '@app/interfaces'

const useStyles = makeStyles({
  messageBarGroup: {
    padding: tokens.spacingHorizontalMNudge,
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10px',
    gap: '10px',
    flex: 1,
    overflow: 'auto',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'end',
    gap: '5px',
  },
})

export const WelcomeMessageBar: React.FC<IChatCompletionListProps> = ({
  chatCompletionList,
}) => {
  const styles = useStyles()

  return (
    <>
      {chatCompletionList.length === 0 && (
        <MessageBarGroup className={styles.messageBarGroup}>
          <MessageBar intent="success">
            <MessageBarBody>
              <MessageBarTitle>Welcome</MessageBarTitle>
              I'm your Copilot and I'm here to help you get things done faster.
              Please read the vscode-openai extensions page for{' '}
              <Link
                href="https://marketplace.visualstudio.com/items?itemName=AndrewButson.vscode-openai"
                inline
              >
                more information
              </Link>{' '}
            </MessageBarBody>
          </MessageBar>
        </MessageBarGroup>
      )}
    </>
  )
}
