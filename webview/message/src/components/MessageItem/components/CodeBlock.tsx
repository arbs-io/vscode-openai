import React, { FC } from 'react'
import { makeStyles } from '@fluentui/react-components'

interface CodeBlockProps {
  children: React.ReactNode
  [key: string]: any
}

const useCodeBlockStyles = makeStyles({
  codeBlock: {
    whiteSpace: 'pre-wrap',
  },
})

const CodeBlock: FC<CodeBlockProps> = ({ children, ...props }) => {
  const MessageItemStyles = useCodeBlockStyles()

  return (
    <code className={`${MessageItemStyles.codeBlock}`} {...props}>
      {children}
    </code>
  )
}

export default CodeBlock
