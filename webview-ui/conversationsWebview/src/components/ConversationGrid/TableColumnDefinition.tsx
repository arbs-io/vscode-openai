import {
  TableCellLayout,
  TableColumnDefinition,
  createTableColumn,
  Persona,
  TableCell,
  Button,
  Tooltip,
  mergeClasses,
  Avatar,
} from '@fluentui/react-components'
import { Open24Regular, Delete24Regular } from '@fluentui/react-icons'
import { IConversation } from '@appInterfaces/IConversation'
import { useStyles } from './useStyles'
import { vscode } from '../../utilities/vscode'

const handleDeleteConversation = (conversation: IConversation) => {
  vscode.postMessage({
    command: 'rcvdViewDeleteConversation',
    text: JSON.stringify(conversation),
  })
}
const handleOpenConversation = (conversation: IConversation) => {
  vscode.postMessage({
    command: 'openConversation',
    text: JSON.stringify(conversation),
  })
}

export const columns: TableColumnDefinition<IConversation>[] = [
  createTableColumn<IConversation>({
    columnId: 'persona',
    compare: (a, b) => {
      return a.persona.roleName.localeCompare(b.persona.roleName)
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
          <Tooltip content="View conversation" relationship="label">
            <Button
              size="small"
              shape="rounded"
              className={mergeClasses(useStyles().horizontalPadding)}
              appearance="transparent"
              icon={<Open24Regular />}
              onClick={() => handleOpenConversation(conversation)}
            />
          </Tooltip>
          <Tooltip
            content="Permanently remove conversation"
            relationship="label"
          >
            <Button
              size="small"
              shape="rounded"
              className={mergeClasses(useStyles().horizontalPadding)}
              appearance="transparent"
              icon={<Delete24Regular />}
              onClick={() => handleDeleteConversation(conversation)}
            />
          </Tooltip>
        </TableCell>
      )
    },
  }),
]
