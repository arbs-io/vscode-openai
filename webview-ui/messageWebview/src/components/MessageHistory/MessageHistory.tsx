import {
  makeStyles,
  tokens,
  Toolbar,
  ToolbarButton,
  Tooltip,
} from '@fluentui/react-components'
import { CSSProperties, FC } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { Clipboard24Regular, Open24Regular } from '@fluentui/react-icons'
import { vscode } from '../../utilities/vscode'
import { TokenInfo } from '../TokenInfo'
import { IMessageHistoryProps, ICodeDocument } from '../../interfaces'

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
    maxWidth: '70%',
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

  const useStyles = makeStyles({
    toolbar: {
      justifyContent: 'right',
    },
  })

  const handleCopyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  const handleCreateCodeDocument = (language: string, content: string) => {
    const codeDocument: ICodeDocument = {
      language: language,
      content: content,
    }
    vscode.postMessage({
      command: 'onDidCreateDocument',
      text: JSON.stringify(codeDocument),
    })
  }

  return (
    <div style={styleMessageHistory}>
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
                <Toolbar
                  aria-label="Small"
                  size="small"
                  {...props}
                  className={useStyles().toolbar}
                >
                  <Tooltip
                    withArrow
                    content="Copy to clipboard"
                    relationship="label"
                  >
                    <ToolbarButton
                      aria-label="Copy to clipboard"
                      appearance="subtle"
                      icon={<Clipboard24Regular />}
                      onClick={() =>
                        handleCopyToClipboard(
                          String(children).replace(/\n$/, '')
                        )
                      }
                    >
                      Copy
                    </ToolbarButton>
                  </Tooltip>
                  <Tooltip
                    withArrow
                    content="Create source code file"
                    relationship="label"
                  >
                    <ToolbarButton
                      aria-label="Open in virtual document"
                      appearance="subtle"
                      icon={<Open24Regular />}
                      onClick={() =>
                        handleCreateCodeDocument(
                          match[1],
                          String(children).replace(/\n$/, '')
                        )
                      }
                    >
                      New
                    </ToolbarButton>
                  </Tooltip>
                </Toolbar>
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
