import {
  DataGridBody,
  DataGridRow,
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridCell,
  TableCellLayout,
  TableColumnDefinition,
  createTableColumn,
  Persona,
  TableCell,
  Button,
  Tooltip,
} from '@fluentui/react-components'
import { Next24Regular } from '@fluentui/react-icons'
import { IConversation } from '@appInterfaces/IConversation'

export const columns: TableColumnDefinition<IConversation>[] = [
  createTableColumn<IConversation>({
    columnId: 'persona',
    compare: (a, b) => {
      return a.persona.roleName.localeCompare(b.persona.roleName)
    },
    renderHeaderCell: () => {
      return 'Persona'
    },
    renderCell: (item) => {
      const overview = `${item.persona.configuration.service} (${item.persona.configuration.model})`
      return (
        <div id="personadiv">
          <TableCell tabIndex={0} role="gridcell">
            <TableCellLayout
              media={
                <Persona
                  presence={{ status: 'out-of-office' }}
                  size="small"
                  name={item.persona.roleName}
                  avatar={{ color: 'colorful' }}
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
          <Tooltip
            content="View the archived conversation"
            relationship="label"
          >
            <Button size="small" icon={<Next24Regular />} />
          </Tooltip>
        </TableCell>
      )
    },
  }),
]
