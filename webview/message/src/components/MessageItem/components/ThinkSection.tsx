import { Button } from '@fluentui/react-components';
import { CommentMultipleLinkRegular } from '@fluentui/react-icons';
import { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ThinkSection: FC<{ content: string }> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <Button
        appearance="outline"
        size="small"
        icon={<CommentMultipleLinkRegular />}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          borderRadius: '8px',
          padding: '0.5rem 1rem',
          fontWeight: 'bold',
        }}
      >
        {isOpen ? 'Collapse' : 'Expand'} Reasoning
      </Button>
      {isOpen && (
        <div>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}

export default ThinkSection
