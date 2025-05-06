import { makeStyles } from '@fluentui/react-components';

export const useMessageItemStyles = makeStyles({
  messageItem: {
    borderRadius: '12px',
    margin: '1rem 0', // Add vertical spacing between messages
    padding: '1.5rem', // Increase padding for better readability
    maxWidth: '80%',
    boxShadow: '0 4px 6px var(--shadowColor)', // Subtle shadow
    border: '1px solid var(--borderColor)', // Add a light border
    backgroundColor: 'var(--assistantBackground)', // Use consistent background
  },
  messageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem', // Add spacing between elements
  },
  messageHeader: {
    paddingBottom: '0.5rem',
    borderBottom: '1px solid var(--borderColor)', // Add a separator
  },
  author: {
    paddingRight: '1rem',
    fontWeight: 'bold',
    color: 'var(--userColor)',
  },
  timestamp: {
    fontSize: '0.875rem',
    color: 'var(--userColor)',
  },
})
