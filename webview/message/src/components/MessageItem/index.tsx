import { FC, useContext } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { IMessageItemProps } from '@app/interfaces'
import {
  CopyToClipboardButton,
  OpenSourceFileButton,
} from '@app/components/Buttons'
import { ConfigurationContext } from '@app/context'
import { useMessageItemStyles } from './styles/useMessageItemStyles'
import MessageItemToolbar from './components/MessageItemToolbar'

export const MessageItem: FC<IMessageItemProps> = ({ message }) => {
  const configuration = useContext(ConfigurationContext)

  if (!message || !configuration) {
    return null
  }

  const MessageItemStyles = useMessageItemStyles()

  const dynamicMessageItemStyle = {
    alignSelf: message.mine ? 'flex-end' : 'flex-start',
    backgroundColor: message.mine
      ? configuration.userBackground
      : configuration.assistantBackground,
    color: message.mine
      ? configuration.userColor
      : configuration.assistantColor,
  }

  return (
    <div
      className={MessageItemStyles.messageItem}
      style={dynamicMessageItemStyle}
      data-vscode-context={JSON.stringify({
        webviewSection: 'message',
        data: message,
      })}
    >
      <div className={MessageItemStyles.messageWrapper}>
        <div className={MessageItemStyles.messageHeader}>
          {/* Conditionally render author if the message is not from the user */}
          {message.mine ? null : (
            <span className={MessageItemStyles.author}>{message.author}</span>
          )}
          <span className={MessageItemStyles.timestamp}>
            {' '}
            Date: {message.timestamp}
          </span>
          {/* Render MessageUtility component if totalTokens is greater than 0 */}
          {message.totalTokens > 0 && <MessageItemToolbar message={message} />}
        </div>
      </div>
      <ReactMarkdown
        children={message.content.trim()}
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <div className={MessageItemStyles.codeContainer}>
                <div className={MessageItemStyles.toolbar}>
                  <CopyToClipboardButton
                    language={match[1]}
                    content={String(children).replace(/\n$/, '')}
                  />
                  <OpenSourceFileButton
                    language={match[1]}
                    content={String(children).replace(/\n$/, '')}
                  />
                </div>
                <SyntaxHighlighter
                  language={match[1]}
                  lineProps={{ style: { whiteSpace: 'pre-wrap' } }}
                  wrapLines={true}
                  wrapLongLines={true}
                  PreTag="div"
                  style={atomDark}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code
                className={`${className} ${MessageItemStyles.codeBlock}`}
                {...props}
              >
                {children}
              </code>
            )
          },
        }}
      />
    </div>
  )
}
