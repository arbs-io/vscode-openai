import React, { FC } from 'react'
import { makeStyles, shorthands } from '@fluentui/react-components'

interface ICodeBlockUnmatchedProps {
  children: React.ReactNode
  [key: string]: any
}

const useCodeBlockUnmatchedStyles = makeStyles({
  codeContainer: {
    ...shorthands.borderWidth('1px'),
    ...shorthands.borderColor('lightgrey'),
    borderRadius: 'var(--borderRadiusSmall)',
    background: 'rgb(50, 50, 50)',
    padding: '0.3rem',
    boxShadow: 'var(--shadow16)',
  },
})

const CodeBlockUnmatched: FC<ICodeBlockUnmatchedProps> = ({
  children,
  ...props
}) => {
  const MessageItemStyles = useCodeBlockUnmatchedStyles()

  return (
    <code className={`${MessageItemStyles.codeContainer}`} {...props}>
      {children}
    </code>
  )
}

export default CodeBlockUnmatched
