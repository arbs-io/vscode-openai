import { FC, useContext } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { IChatCompletionProps } from '@app/interfaces'
import { ConfigurationContext } from '@app/context'
import { useMessageItemStyles } from './styles/useMessageItemStyles'
import {
  CodeBlockMatched,
  CodeBlockUnmatched,
  MessageItemToolbar,
} from './components'

export const MessageItem: FC<IChatCompletionProps> = ({ chatCompletion }) => {
  const configuration = useContext(ConfigurationContext)
  const MessageItemStyles = useMessageItemStyles()

  if (!chatCompletion || !configuration) {
    return null
  }

  const dynamicMessageItemStyle = {
    alignSelf: chatCompletion.mine ? 'flex-end' : 'flex-start',
    backgroundColor: chatCompletion.mine
      ? configuration.userBackground
      : configuration.assistantBackground,
    color: chatCompletion.mine
      ? configuration.userColor
      : configuration.assistantColor,
  }

  return (
    <div
      className={MessageItemStyles.messageItem}
      style={dynamicMessageItemStyle}
      data-vscode-context={JSON.stringify({
        webviewSection: 'message',
        data: chatCompletion,
      })}
    >
      <div className={MessageItemStyles.messageWrapper}>
        <div className={MessageItemStyles.messageHeader}>
          {/* Conditionally render author if the message is not from the user */}
          {chatCompletion.mine ? null : (
            <span className={MessageItemStyles.author}>
              {chatCompletion.author}
            </span>
          )}
          <span className={MessageItemStyles.timestamp}>
            {' '}
            Date: {chatCompletion.timestamp}
          </span>
          {/* Render MessageUtility component if totalTokens is greater than 0 */}
          {chatCompletion.totalTokens > 0 && (
            <MessageItemToolbar chatCompletion={chatCompletion} />
          )}
        </div>
      </div>
      <ReactMarkdown
        children={chatCompletion.content.trim()}
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { children, className, node, ...rest } = props
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <CodeBlockMatched
                language={match[1]}
                content={String(children).replace(/\n$/, '')}
              />
            ) : (
              <CodeBlockUnmatched {...rest}>{children}</CodeBlockUnmatched>
            )
          },
        }}
      />
    </div>
  )
}
