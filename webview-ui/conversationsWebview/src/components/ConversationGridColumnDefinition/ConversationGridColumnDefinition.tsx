import {
  TableCellLayout,
  TableColumnDefinition,
  createTableColumn,
  TableCell,
  Avatar,
} from '@fluentui/react-components'
import { IConversation } from '../../interfaces'
import { DeleteButton, OpenButton, DownloadButton } from '../Buttons'

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
              style={{ paddingRight: '1rem' }}
            />
            <OpenButton conversation={conversation} />
            <DownloadButton conversation={conversation} />
            <DeleteButton conversation={conversation} />
          </TableCell>
        )
      },
    }),
  ]
export default ConversationGridColumnDefinition
