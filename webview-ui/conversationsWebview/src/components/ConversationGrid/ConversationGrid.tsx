import { FC, useEffect, useCallback, useState } from 'react'
import {
  DataGridBody,
  DataGridRow,
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridCell,
  mergeClasses,
  makeStyles,
} from '@fluentui/react-components'
import { ConversationGridColumnDefinition } from '../ConversationGridColumnDefinition'
import { IConversation } from '../../interfaces'
import { vscode } from '../../utilities/vscode'

const componentStyles = makeStyles({
  verticalPadding: {
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    cursor: 'context-menu',
  },
})

const ConversationGrid: FC = () => {
  const [didInitialize, setDidInitialize] = useState<boolean>(false)
  const [state, setState] = useState<MessageEvent>()
  const [conversations, setConversations] = useState<IConversation[]>([])

  const onMessageReceivedFromIframe = useCallback(
    (event: MessageEvent) => {
      switch (event.data.command) {
        case 'onWillConversationsLoad': {
          const rcvConversations: IConversation[] = JSON.parse(event.data.text)
          setConversations(rcvConversations)
          console.log(rcvConversations)
          break
        }
      }

      setState(event)
    },
    [state]
  )

  useEffect(() => {
    window.addEventListener('message', onMessageReceivedFromIframe)

    if (!didInitialize) {
      vscode.postMessage({
        command: 'onDidInitialize',
        text: undefined,
      })
      setDidInitialize(true)
    }

    return () =>
      window.removeEventListener('message', onMessageReceivedFromIframe)
  }, [onMessageReceivedFromIframe])

  return (
    <DataGrid
      size="extra-small"
      items={conversations}
      columns={ConversationGridColumnDefinition}
      getRowId={(item) => item.itemId}
      resizableColumns
      columnSizingOptions={{
        persona: {
          minWidth: 35,
          defaultWidth: 35,
          idealWidth: 35,
        },
      }}
    >
      <DataGridHeader>
        <DataGridRow>
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<IConversation>>
        {({ item, rowId }) => (
          <DataGridRow<IConversation>
            key={rowId}
            className={mergeClasses(componentStyles().verticalPadding)}
            data-vscode-context={JSON.stringify({
              webviewSection: 'conversation',
              data: item,
            })}
          >
            {({ renderCell }) => (
              <DataGridCell>{renderCell(item)}</DataGridCell>
            )}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  )
}

export default ConversationGrid
