import { FC, useState, useEffect } from 'react'
import { makeStyles, mergeClasses } from '@fluentui/react-components'
import { MessageInteraction } from './components/MessageInteraction'
import { vscode } from './utilities'

const useStyles = makeStyles({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
})

const App: FC = () => {
  const [didInitialize, setDidInitialize] = useState<boolean>(false)

  const styles = useStyles()

  useEffect(() => {
    if (!didInitialize) {
      vscode.postMessage({
        command: 'onDidInitialize',
        text: undefined,
      })
      setDidInitialize(true)
    }
  })

  return (
    <div className={mergeClasses(styles.container)}>
      <MessageInteraction />
    </div>
  )
}

export default App
