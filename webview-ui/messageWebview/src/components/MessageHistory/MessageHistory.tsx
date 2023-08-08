import { makeStyles, tokens } from '@fluentui/react-components'
import { CSSProperties, FC } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { TokenInfo } from '../TokenInfo'
import { IMessageHistoryProps } from '../../interfaces'
import { CopyToClipboardButton } from '../Buttons'
import OpenSourceFileButton from '../Buttons/OpenSourceFileButton'

const MessageHistory: FC<IMessageHistoryProps> = ({ message }) => {
  if (!message) {
    throw new Error('Invalid memory')
  }

  const styleMessageHistory: CSSProperties = {
    alignSelf: message.mine ? 'flex-end' : 'flex-start',
    backgroundColor: message.mine
      ? tokens.colorNeutralBackground4
      : tokens.colorPaletteGreenBackground1,
    color: message.mine
      ? tokens.colorNeutralForeground3Hover
      : tokens.colorPaletteGreenForeground3,
    borderRadius: tokens.borderRadiusXLarge,
    margin: '1rem',
    padding: '1rem',
    maxWidth: '80%',
    boxShadow: tokens.shadow64,
  }

  const styleCode: CSSProperties = {
    borderWidth: '1rem',
    borderColor: 'lightgrey',
    borderRadius: tokens.borderRadiusSmall,
    padding: '0.3rem',
    boxShadow: tokens.shadow16,
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

  return (
    <div
      style={styleMessageHistory}
      data-vscode-context='{"webviewSection": "menu"}'
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ paddingBottom: 10 }}>
          {message.mine ? null : (
            <span style={{ paddingRight: 20, fontWeight: 'bold' }}>
              {message.author}
            </span>
          )}
          <span style={{ fontSize: 10 }}> Date: {message.timestamp}</span>
          {message.totalTokens > 0 && <TokenInfo message={message} />}
        </div>
      </div>
      <ReactMarkdown
        children={message.content.trim()}
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
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
                  {...props}
                  style={vscDarkPlus}
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
