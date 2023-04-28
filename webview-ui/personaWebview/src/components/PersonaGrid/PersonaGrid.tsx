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
import { PersonaGridColumnDefinition } from '../PersonaGridColumnDefinition'
import { IPersonaOpenAI, IPersonaGridProps } from '../../interfaces'
import { vscode } from '../../utilities/vscode'

const PersonaGrid: FC<IPersonaGridProps> = ({ personas }) => {
  const [selectedPersona, setSelectedPersona] = useState<TableRowId>(
    '627026d2-8df7-4bd2-9fb8-7a478309f9bf'
  )
  const defaultSelectedItems: Array<TableRowId> = [selectedPersona]

  const handleChangePersona = (selectedItems: Set<TableRowId>) => {
    selectedItems.forEach((item) => {
      setSelectedPersona(item)
    })
  }
  const handleNewChat = () => {
    if (selectedPersona === undefined) return

    personas.forEach((persona) => {
      if (persona.roleId == selectedPersona) {
        vscode.postMessage({
          command: 'onDidConversationCreate',
          text: JSON.stringify(persona),
        })
        return
      }
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
        columns={PersonaGridColumnDefinition}
        sortable
        selectionMode="single"
        getRowId={(item) => item.roleId}
        defaultSelectedItems={defaultSelectedItems}
        onSelectionChange={(e, data) => handleChangePersona(data.selectedItems)}
        columnSizingOptions={{
          persona: {
            minWidth: 150,
            defaultWidth: 150,
            idealWidth: 150,
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
