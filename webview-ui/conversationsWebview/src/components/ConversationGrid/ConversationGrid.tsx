import { FC, useState } from 'react'
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

const componentStyles = makeStyles({
  verticalPadding: {
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
    cursor: 'context-menu',
  },
  horizontalPadding: {
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
    cursor: 'context-menu',
  },
})

const ConversationGrid: FC = () => {
  const [conversations, setConversations] = useState<IConversation[]>([])
  window.addEventListener('message', (event: MessageEvent) => {
    console.log(event.origin)
    if (!event.origin.startsWith('vscode-webview://')) return
    const message = event.data // The JSON data our extension sent
    switch (message.command) {
      case 'onWillConversationsLoad': {
        const rcvConversations: IConversation[] = JSON.parse(event.data.text)
        console.log(`onWillConversationsLoad::rcv ${rcvConversations.length}`)
        console.log(rcvConversations)
        setConversations(rcvConversations)
        console.log(`onWillConversationsLoad::set ${conversations.length}`)
        console.log(conversations)
        break
      }
    }
  })

  return (
    <DataGrid
      size="extra-small"
      items={conversations}
      columns={ConversationGridColumnDefinition}
      getRowId={(item) => item.itemId}
      resizableColumns
      columnSizingOptions={{
        persona: {
          minWidth: 30,
          defaultWidth: 30,
          idealWidth: 30,
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
