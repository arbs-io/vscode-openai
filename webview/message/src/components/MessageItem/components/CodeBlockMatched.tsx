import { ButtonCopyToClipboard } from '@app/components/ButtonCopyToClipboard';
import { ButtonOpenSourceFile } from '@app/components/ButtonOpenSourceFile';
import { makeStyles } from '@fluentui/react-components';
import { FC } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ICodeBlockMatchedProps {
  language: string
  content: string
}

const useCodeBlockMatchedStyles = makeStyles({
  codeContainer: {
    backgroundColor: 'rgba(255, 255, 255,0.3)',
    padding: '0.3rem',
    paddingBottom: '0.1rem',
    borderRadius: '16px',
    overflowX: 'auto',
    whiteSpace: 'pre',
  },

  toolbar: {
    display: 'flex',
    justifyContent: 'right',
    marginBottom: '0.5rem',
  },
});

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
