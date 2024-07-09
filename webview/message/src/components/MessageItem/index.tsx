import { FC, useContext } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { IChatCompletionProps } from '@app/interfaces'
import { ButtonCopyToClipboard } from '@app/components/ButtonCopyToClipboard'
import { ButtonOpenSourceFile } from '@app/components/ButtonOpenSourceFile'
import { ConfigurationContext } from '@app/context'
import { useMessageItemStyles } from './styles/useMessageItemStyles'
import { CodeBlock, MessageItemToolbar } from './components'

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
              <div className={MessageItemStyles.codeContainer}>
                <div className={MessageItemStyles.toolbar}>
                  <ButtonCopyToClipboard
                    language={match[1]}
                    content={String(children).replace(/\n$/, '')}
                  />
                  <ButtonOpenSourceFile
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
              <CodeBlock {...rest}>{children}</CodeBlock>
            )
          },
        }}
      />
    </div>
  )
}
