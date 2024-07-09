import { FC, useContext } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { MessageUtility } from '@app/components/MessageUtility'
import { IMessageHistoryProps } from '@app/interfaces'
import {
  CopyToClipboardButton,
  OpenSourceFileButton,
} from '@app/components/Buttons'
import { ConfigurationContext } from '@app/context'
import { useMessageHistoryStyles } from './useMessageHistoryStyles'

const MessageHistory: FC<IMessageHistoryProps> = ({ message }) => {
  const configuration = useContext(ConfigurationContext)

  if (!message || !configuration) {
    return null
  }

  const messageHistoryStyles = useMessageHistoryStyles()

  const dynamicMessageHistoryStyle = {
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
      className={messageHistoryStyles.messageHistory}
      style={dynamicMessageHistoryStyle}
      data-vscode-context={JSON.stringify({
        webviewSection: 'message',
        data: message,
      })}
    >
      <div className={messageHistoryStyles.messageWrapper}>
        <div className={messageHistoryStyles.messageHeader}>
          {/* Conditionally render author if the message is not from the user */}
          {message.mine ? null : (
            <span className={messageHistoryStyles.author}>
              {message.author}
            </span>
          )}
          <span className={messageHistoryStyles.timestamp}>
            {' '}
            Date: {message.timestamp}
          </span>
          {/* Render MessageUtility component if totalTokens is greater than 0 */}
          {message.totalTokens > 0 && <MessageUtility message={message} />}
        </div>
      </div>
      <ReactMarkdown
        children={message.content.trim()}
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <div className={messageHistoryStyles.codeContainer}>
                <div className={messageHistoryStyles.toolbar}>
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
                className={`${className} ${messageHistoryStyles.codeBlock}`}
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

export default MessageHistory
