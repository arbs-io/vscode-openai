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
  makeStyles,
  mergeClasses,
} from '@fluentui/react-components'
import { ChatHelp24Regular } from '@fluentui/react-icons'
import { Item, Items } from './data/Items'

const useStyles = makeStyles({
  tableCell: {
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
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
                  presence={{ status: 'available' }}
                  size="medium"
                  name={item.persona.role}
                  tertiaryText={overview}
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
    columnId: 'prompt',
    renderHeaderCell: () => {
      return 'Prompt'
    },
    renderCell: (item) => {
      return (
        <TableCell tabIndex={0} role="gridcell">
          <TableCellLayout description={item.prompt.label} />
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
      selectionMode="single"
      getRowId={(item) => item.itemId}
      onSelectionChange={(e, data) => console.log(`clicked: ${data}`)}
      resizableColumns
      columnSizingOptions={{
        persona: {
          minWidth: 180,
          defaultWidth: 180,
          idealWidth: 180,
        },
        summary: {
          defaultWidth: 180,
          minWidth: 120,
          idealWidth: 180,
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
