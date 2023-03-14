import { makeStyles, mergeClasses } from '@fluentui/react-components'
import { FC } from 'react'
import MessageInteraction from './components/MessageInteraction'

const useStyles = makeStyles({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
})

const App: FC = () => {
  const styles = useStyles()

  return (
    <div className={mergeClasses(styles.container)}>
      <MessageInteraction />
    </div>
  )
}

export default App
