import { ButtonCopyToClipboard } from '@app/components/ButtonCopyToClipboard';
import { ButtonOpenSourceFile } from '@app/components/ButtonOpenSourceFile';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { FC } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ICodeBlockMatchedProps {
  language: string
  content: string
}

const useCodeBlockMatchedStyles = makeStyles({
  codeContainer: {
    borderRadius: '8px',
    ...shorthands.borderColor('lightgray'),
    background: tokens.colorBackgroundOverlay,
    padding: '1rem',
    overflowX: 'auto',
    whiteSpace: 'pre',
    boxShadow: '0 4px 6px var(--shadowColor)',
    border: '1px solid var(--borderColor)',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
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
        style={tomorrow} // Use a modern syntax highlighting theme
        showLineNumbers
        wrapLongLines
      >
        {content}
      </SyntaxHighlighter>
    </div>
  )
}

export default CodeBlockMatched
