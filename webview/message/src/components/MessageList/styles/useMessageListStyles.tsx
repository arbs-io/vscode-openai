import { makeStyles } from '@fluentui/react-components'

export const useMessageListStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    width: 'auto',
    height: 'auto',
  },
  history: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    rowGap: '2px',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingBottom: '7rem',
    overflowY: 'auto',
  },
  input: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: '2rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingTop: '2rem',
  },
})
