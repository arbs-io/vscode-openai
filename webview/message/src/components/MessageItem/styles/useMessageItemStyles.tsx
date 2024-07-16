import { makeStyles } from '@fluentui/react-components'

export const useMessageItemStyles = makeStyles({
  messageItem: {
    borderRadius: 'var(--borderRadiusXLarge)',
    margin: '1rem',
    padding: '1rem',
    maxWidth: '80%',
    boxShadow: 'var(--shadow64)',
  },
  messageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  messageHeader: {
    paddingBottom: '10px',
  },
  author: {
    paddingRight: '20px',
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: '10px',
  },
})
