import { FC } from 'react'
import { makeStyles, shorthands, tokens } from '@fluentui/react-components'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ButtonCopyToClipboard } from '@app/components/ButtonCopyToClipboard'
import { ButtonOpenSourceFile } from '@app/components/ButtonOpenSourceFile'

interface ICodeBlockMatchedProps {
  language: string
  content: string
}

export const useCodeBlockMatchedStyles = makeStyles({
  codeContainer: {
    ...shorthands.borderWidth('3px'),
    ...shorthands.borderColor('grey'),
    borderRadius: 'var(--borderRadiusLarge)',
    background: tokens.colorBackgroundOverlay,
    padding: '0.5rem',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
})

const CodeBlockMatched: FC<ICodeBlockMatchedProps> = ({
  language,
  content,
}) => {
  const MessageItemStyles = useCodeBlockMatchedStyles()

  return (
    <div className={MessageItemStyles.codeContainer}>
      <div className={MessageItemStyles.toolbar}>
        <ButtonCopyToClipboard language={language} content={content} />
        <ButtonOpenSourceFile language={language} content={content} />
      </div>
      <SyntaxHighlighter
        language={language}
        wrapLines={true}
        wrapLongLines={true}
        PreTag="div"
        style={vscDarkPlus}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  )
}

export default CodeBlockMatched
