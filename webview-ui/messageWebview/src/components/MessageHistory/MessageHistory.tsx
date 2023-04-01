import {
  makeStyles,
  tokens,
  Toolbar,
  ToolbarButton,
} from '@fluentui/react-components'
import { CSSProperties, FC } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { default as IData } from './IData'
import { Clipboard24Regular, Open24Regular } from '@fluentui/react-icons'

const MessageHistory: FC<IData> = ({ message }) => {
  if (!message) {
    throw new Error('Invalid memory')
  }

  const style: CSSProperties = {
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
    maxWidth: '70%',
    boxShadow: tokens.shadow64,
  }

  const styleCode: CSSProperties = {
    backgroundColor: tokens.colorPalettePlatinumBackground2,
    borderRadius: tokens.borderRadiusSmall,
    padding: '0.5rem',
    boxShadow: tokens.shadow16,
  }

  const styleWrap: CSSProperties = {
    whiteSpace: 'pre-wrap',
  }

  const useStyles = makeStyles({
    toolbar: {
      justifyContent: 'right',
    },
  })

  return (
    <div style={style}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ paddingBottom: 10 }}>
          {message.mine ? null : (
            <span style={{ paddingRight: 20, fontWeight: 'bold' }}>
              {message.author}
            </span>
          )}
          <span style={{ fontSize: 10 }}> Date: {message.timestamp}</span>
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
                <Toolbar
                  aria-label="Small"
                  size="small"
                  {...props}
                  className={useStyles().toolbar}
                >
                  <ToolbarButton
                    aria-label="Copy to clipboard"
                    appearance="subtle"
                    icon={<Clipboard24Regular />}
                  />
                  <ToolbarButton
                    aria-label="Open in virtual document"
                    appearance="subtle"
                    icon={<Open24Regular />}
                  />
                </Toolbar>
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, '')}
                  language={match[1]}
                  lineProps={{ style: { whiteSpace: 'pre-wrap' } }}
                  wrapLines={true}
                  wrapLongLines={true}
                  PreTag="div"
                  {...props}
                  style={tomorrow}
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
