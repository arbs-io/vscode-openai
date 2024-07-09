import { FC, useState, useEffect } from 'react'
import { makeStyles, mergeClasses } from '@fluentui/react-components'
import { MessageList } from './components/MessageList'
import { vscode } from '@app/utilities'

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
      <MessageList />
    </div>
  )
}

export default App
