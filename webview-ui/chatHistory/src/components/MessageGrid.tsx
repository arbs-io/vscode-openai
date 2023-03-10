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
  makeStyles,
  mergeClasses,
} from '@fluentui/react-components'
import { Next24Regular } from '@fluentui/react-icons'
import { Item, Items } from './data/Items'

const useStyles = makeStyles({
  tableCell: {
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
  },
})
const columns: TableColumnDefinition<Item>[] = [
  createTableColumn<Item>({
    columnId: 'persona',
    compare: (a, b) => {
      return a.persona.role.localeCompare(b.persona.role)
    },
    renderHeaderCell: () => {
      return 'Persona'
    },
    renderCell: (item) => {
      const overview = `${item.persona.service} (${item.persona.model})`
      return (
        <div id="personadiv">
          <TableCell tabIndex={0} role="gridcell">
            <TableCellLayout
              media={
                <Persona
                  presence={{ status: 'out-of-office' }}
                  size="small"
                  name={item.persona.role}
                  avatar={{ color: 'colorful' }}
                />
              }
            />
          </TableCell>
        </div>
      )
    },
  }),

  createTableColumn<Item>({
    columnId: 'summary',
    renderHeaderCell: () => {
      return 'Summary'
    },
    renderCell: (item) => {
      return (
        <TableCell tabIndex={0} role="gridcell">
          <TableCellLayout description={item.summary.label} style={{paddingRight: '1rem'}} />
          <Tooltip content="View the archived conversation" relationship="label">
              <Button size="small" icon={<Next24Regular />} />
            </Tooltip>
        </TableCell>
      )
    },
  }),
]

export const Default = () => {
  return (
    <DataGrid
      size="extra-small"
      items={Items}
      ref={(el) => console.log('__Ref', el)}
      columns={columns}
      sortable
      getRowId={(item) => item.itemId}
      resizableColumns
      columnSizingOptions={{
        persona: {
          minWidth: 120,
          defaultWidth: 120,
          idealWidth: 120,
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
      <DataGridBody<Item>>
        {({ item, rowId }) => (
          <DataGridRow<Item>
            key={rowId}
            className={mergeClasses(useStyles().tableCell)}
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
