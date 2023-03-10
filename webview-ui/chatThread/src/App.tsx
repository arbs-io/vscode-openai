import { makeStyles, mergeClasses } from '@fluentui/react-components'
import { FC } from 'react'
import ChatInteraction from './components/ChatInteraction'

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
      <ChatInteraction />
    </div>
  )
}

export default App
