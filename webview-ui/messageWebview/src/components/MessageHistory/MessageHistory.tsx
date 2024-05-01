import { makeStyles } from '@fluentui/react-components'
import { CSSProperties, FC, useContext } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { MessageUtility } from '../MessageUtility'
import { IMessageHistoryProps } from '../../interfaces'
import { CopyToClipboardButton, OpenSourceFileButton } from '../Buttons'
import { ConfigurationContext } from '../../utilities'

const MessageHistory: FC<IMessageHistoryProps> = ({ message }) => {
  const configuration = useContext(ConfigurationContext)

  // Define CSS styles using CSSProperties for better type safety and IntelliSense support in IDEs.
  const styleMessageHistory: CSSProperties = {
    alignSelf: message?.mine ? 'flex-end' : 'flex-start',
    backgroundColor: message?.mine
      ? configuration?.userBackground
      : configuration?.assistantBackground,
    color: message?.mine
      ? configuration?.userColor
      : configuration?.assistantColor,
    borderRadius: 'var(--borderRadiusXLarge)',
    margin: '1rem',
    padding: '1rem',
    maxWidth: '80%',
    boxShadow: 'var(--shadow64)',
  }

  const styleCode: CSSProperties = {
    borderWidth: '1px',
    borderColor: 'lightgrey',
    borderRadius: 'var(--borderRadiusSmall)',
    padding: '0.3rem',
    boxShadow: 'var(--shadow16)',
  }

  const styleWrap: CSSProperties = {
    whiteSpace: 'pre-wrap',
  }

  const componentStyles = makeStyles({
    toolbar: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
  })

  // Early return for undefined message or configuration to handle potential null values gracefully.
  if (!message || !configuration) {
    return null // Optionally, you could return a fallback UI component here.
  }

  return (
    <div
      style={styleMessageHistory}
      data-vscode-context={JSON.stringify({
        webviewSection: 'message',
        data: message,
      })}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ paddingBottom: '10px' }}>
          {message.mine ? null : (
            <span style={{ paddingRight: '20px', fontWeight: 'bold' }}>
              {message.author}
            </span>
          )}
          <span style={{ fontSize: '10px' }}> Date: {message.timestamp}</span>
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
              <div style={styleCode}>
                <div className={componentStyles().toolbar}>
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
                  children={String(children).replace(/\n$/, '')}
                  language={match[1]}
                  lineProps={{ style: { whiteSpace: 'pre-wrap' } }}
                  wrapLines={true}
                  wrapLongLines={true}
                  PreTag="div"
                  style={atomDark}
                />
              </div>
            ) : (
              <code className={className} style={styleWrap} {...props}>
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
