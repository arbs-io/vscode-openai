import { tokens } from '@fluentui/react-components'
import { CSSProperties, FC } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { IChatMessage } from '../interfaces/IChatMessage'

interface IData {
  message: IChatMessage
}
export const MessageHistory: FC<IData> = ({ message }) => {
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
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                wrapLongLines={true}
                // wrapLines={true}
                // lineProps={{
                //   style: { whiteSpace: 'pre-wrap' },
                // }}
                PreTag="div"
                {...props}
                style={tomorrow}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
        }}
      />
    </div>
  )
}
