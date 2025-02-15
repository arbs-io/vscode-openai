import { FC, useState } from 'react'
import { Button } from '@fluentui/react-components'
import { CommentMultipleLinkRegular } from '@fluentui/react-icons'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const ThinkSection: FC<{ content: string }> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <Button
        appearance="subtle"
        size="small"
        icon={<CommentMultipleLinkRegular />}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Collapse' : 'Expand'} Thought
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
