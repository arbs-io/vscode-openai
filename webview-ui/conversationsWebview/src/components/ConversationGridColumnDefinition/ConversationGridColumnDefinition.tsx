import {
  TableCellLayout,
  TableColumnDefinition,
  createTableColumn,
  TableCell,
  Button,
  Tooltip,
  mergeClasses,
  Avatar,
} from '@fluentui/react-components'
import { Open24Regular } from '@fluentui/react-icons'
import { IConversation } from '../../interfaces'
import { useStyles } from '../ConversationGrid/useStyles'
import { vscode } from '../../utilities/vscode'
import { ButtonDelete } from '../ButtonDelete'
import { ButtonOpen } from '../ButtonOpen'

const handleOpenConversation = (conversation: IConversation) => {
  vscode.postMessage({
    command: 'onDidConversationOpen',
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
            <ButtonOpen conversation={conversation} />
            <ButtonDelete conversation={conversation} />
          </TableCell>
        )
      },
    }),
  ]
export default ConversationGridColumnDefinition
