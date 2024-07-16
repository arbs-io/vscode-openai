import React, { FC } from 'react'
import { makeStyles } from '@fluentui/react-components'

interface ICodeBlockUnmatchedProps {
  children: React.ReactNode
  [key: string]: any
}

const useCodeBlockUnmatchedStyles = makeStyles({
  CodeBlockUnmatched: {
    // whiteSpace: 'pre-wrap',
  },
})

const CodeBlockUnmatched: FC<ICodeBlockUnmatchedProps> = ({
  children,
  ...props
}) => {
  const MessageItemStyles = useCodeBlockUnmatchedStyles()

  return (
    <code className={`${MessageItemStyles.CodeBlockUnmatched}`} {...props}>
      {children}
    </code>
  )
}

export default CodeBlockUnmatched
