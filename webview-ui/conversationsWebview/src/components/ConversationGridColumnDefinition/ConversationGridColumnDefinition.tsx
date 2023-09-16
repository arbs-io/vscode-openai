import {
  TableCellLayout,
  TableColumnDefinition,
  createTableColumn,
  TableCell,
  Avatar,
} from '@fluentui/react-components'
import { IConversation } from '../../interfaces'
import { vscode } from '../../utilities/vscode'

const handleOpenConversation = (conversation: IConversation) => {
  vscode.postMessage({
    command: 'onDidOpenConversationWebview',
    text: JSON.stringify(conversation),
  })
}

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
                    badge={{ status: 'available', outOfOffice: true }}
                    name={item.persona.roleName}
                    size={32}
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
              style={{ cursor: 'pointer' }}
            />
          </TableCell>
        )
      },
    }),
  ]
export default ConversationGridColumnDefinition
