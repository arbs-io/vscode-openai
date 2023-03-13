import { FC, useState } from 'react'
import {
  DataGridBody,
  DataGridRow,
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridCell,
  mergeClasses,
  Button,
  TableRowId,
} from '@fluentui/react-components'
import { Chat24Regular } from '@fluentui/react-icons'
import { useStyles } from './useStyles'
import { columns } from './TableColumnDefinition'
import { vscode } from '../utilities/vscode'
import { IPersonaOpenAI } from '../types/IPersonaOpenAI'

interface IData {
  personas: IPersonaOpenAI[]
}

const PersonaGrid: FC<IData> = ({ personas }) => {
  const [selectedPersona, setSelectedPersona] = useState<
    TableRowId | undefined
  >(undefined)

  const handleChangePersona = (selectedItems: Set<TableRowId>) => {
    selectedItems.forEach((item) => {
      setSelectedPersona(item)
    })
  }
  const handleNewChat = () => {
    if (selectedPersona === undefined) return

    vscode.postMessage({
      command: 'newConversation',
      text: selectedPersona,
    })
  }

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
        items={personas}
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
        <DataGridBody<IPersonaOpenAI>>
          {({ item, rowId }) => (
            <DataGridRow<IPersonaOpenAI>
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
export default PersonaGrid
