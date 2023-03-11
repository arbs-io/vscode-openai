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
  Button,
  TableRowId,
} from '@fluentui/react-components'
import { Chat24Regular } from '@fluentui/react-icons'
import { vscode } from '../utilities/vscode'
import { SystemPersonas } from './data/SystemPersonas'
import { PersonaOpenAI } from './types/PersonaOpenAI'

const useStyles = makeStyles({
  tableCell: {
    paddingBottom: '0.5rem',
  },
  wrapper: {
    columnGap: '15px',
    paddingTop: '0.5rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingBottom: '0.5rem',
    display: 'grid',
  },
})

let selectedPersona: TableRowId
const handleChangePersona = (selectedItems: Set<TableRowId>) => {
  selectedItems.forEach((item) => {
    selectedPersona = item
  })
}
const handleNewChat = () => {
  if (selectedPersona === undefined) return

  vscode.postMessage({
    command: 'newChatThread',
    text: selectedPersona,
  })
}

export const Default = () => {
  return (
    <div>
      <div className={useStyles().wrapper}>
        <Button
          appearance="primary"
          icon={<Chat24Regular />}
          onClick={handleNewChat}
        >
          New Chat
        </Button>
      </div>
      <DataGrid
        size="extra-small"
        items={SystemPersonas}
        ref={(el) => console.log('__Ref', el)}
        columns={columns}
        sortable
        selectionMode="single"
        getRowId={(item) => item.itemId}
        onSelectionChange={(e, data) => handleChangePersona(data.selectedItems)}
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
        <DataGridBody<PersonaOpenAI>>
          {({ item, rowId }) => (
            <DataGridRow<PersonaOpenAI>
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
    </div>
  )
}

const columns: TableColumnDefinition<PersonaOpenAI>[] = [
  createTableColumn<PersonaOpenAI>({
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

  createTableColumn<PersonaOpenAI>({
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
