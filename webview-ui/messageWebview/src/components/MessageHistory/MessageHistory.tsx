import { makeStyles } from '@fluentui/react-components'
import { CSSProperties, FC, useContext } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { MessageUtility } from '../MessageUtility'
import { IMessageHistoryProps } from '../../interfaces'
import { CopyToClipboardButton } from '../Buttons'
import OpenSourceFileButton from '../Buttons/OpenSourceFileButton'
import { ConfigurationContext } from '../../utilities'

const MessageHistory: FC<IMessageHistoryProps> = ({ message }) => {
  // Removed the error throwing as it's not a good practice to throw errors in a component render method
  const configuration = useContext(ConfigurationContext)
  // Removed the error throwing for configuration context as well

  const styleMessageHistory: CSSProperties = {
    alignSelf: message?.mine ? 'flex-end' : 'flex-start', // Used optional chaining to prevent accessing properties of undefined
    backgroundColor: message?.mine
      ? configuration?.userBackground // Used optional chaining for configuration
      : configuration?.assistantBackground, // Used optional chaining for configuration
    color: message?.mine
      ? configuration?.userColor // Used optional chaining for configuration
      : configuration?.assistantColor, // Used optional chaining for configuration
    borderRadius: 'var(--borderRadiusXLarge)', // Replaced tokens with CSS variable
    margin: '1rem',
    padding: '1rem',
    maxWidth: '80%',
    boxShadow: 'var(--shadow64)', // Replaced tokens with CSS variable
  }

  const styleCode: CSSProperties = {
    borderWidth: '1px', // Changed from '1rem' to '1px' for a more appropriate border width
    borderColor: 'lightgrey',
    borderRadius: 'var(--borderRadiusSmall)', // Replaced tokens with CSS variable
    padding: '0.3rem',
    boxShadow: 'var(--shadow16)', // Replaced tokens with CSS variable
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

  // Check if message or configuration is undefined and return null or a fallback UI instead
  if (!message || !configuration) {
    return null // or return <FallbackComponent />;
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
