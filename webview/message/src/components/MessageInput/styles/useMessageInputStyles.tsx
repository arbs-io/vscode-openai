import { makeStyles } from '@fluentui/react-components'

export const useMessageInputStyles = makeStyles({
  outerWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  textLayer: {
    height: '100%',
  },
  hidden: {
    visibility: 'hidden',
  },
})
