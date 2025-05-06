import { IChatCompletionListProps } from '@app/interfaces';
import {
  makeStyles,
  MessageBar,
  MessageBarBody,
  MessageBarGroup,
  MessageBarTitle,
  tokens
} from '@fluentui/react-components';
import * as React from 'react';

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
          <MessageBar intent="info">
            <MessageBarTitle>Welcome to Copilot Chat</MessageBarTitle>
            <MessageBarBody>
              I'm here to assist you with your coding tasks. Explore the features and let me know how I can help!
            </MessageBarBody>
          </MessageBar>
        </MessageBarGroup>
      )}
    </>
  )
}
