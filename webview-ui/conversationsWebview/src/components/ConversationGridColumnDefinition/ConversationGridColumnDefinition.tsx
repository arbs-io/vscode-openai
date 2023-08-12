import {
  TableCellLayout,
  TableColumnDefinition,
  createTableColumn,
  TableCell,
  Avatar,
} from '@fluentui/react-components'
import { IConversation } from '../../interfaces'
import { ContextMenu } from '../Menu'
import { vscode } from '../../utilities/vscode'

const handleOpenConversation = (conversation: IConversation) => {
  vscode.postMessage({
    command: 'onDidOpenConversationWebview',
    text: JSON.stringify(conversation),
  })
}

//await navigator.clipboard.write(data)

const ConversationGridColumnDefinition: TableColumnDefinition<IConversation>[] =
  [
    createTableColumn<IConversation>({
      columnId: 'persona',
      compare: (a, b) => {
        return a.timestamp - b.timestamp
      },
      renderHeaderCell: () => {
        return ''
      },
      renderCell: (item) => {
        return (
          <div id="personadiv">
            <TableCell tabIndex={0} role="gridcell">
              <TableCellLayout
                media={
                  <Avatar
                    badge={{ status: 'offline' }}
                    name={item.persona.roleName}
                    color="colorful"
                  />
                }
              />
            </TableCell>
          </div>
        )
      },
    }),
    createTableColumn<IConversation>({
      columnId: 'summary',
      compare: (a, b) => {
        return a.timestamp - b.timestamp
      },
      renderHeaderCell: () => {
        return 'Summary'
      },
      renderCell: (conversation) => {
        return (
          <TableCell tabIndex={0} role="gridcell">
            <TableCellLayout
              description={conversation.summary}
              onClick={() => handleOpenConversation(conversation)}
              style={{ paddingRight: '1rem', cursor: 'pointer' }}
            />
            <ContextMenu conversation={conversation} />
          </TableCell>
        )
      },
    }),
  ]
export default ConversationGridColumnDefinition
