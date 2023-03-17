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
import { useStyles } from './PersonaGrid/useStyles'
import { columns } from './PersonaGrid/TableColumnDefinition'
import IPersonaOpenAI from '@appInterfaces/IPersonaOpenAI'
import { vscode } from '../../utilities/vscode'

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

    personas.forEach((persona) => {
      if (persona.roleId == selectedPersona) {
        console.log(`${persona.roleId} == ${selectedPersona}`)
        vscode.postMessage({
          command: 'newConversation',
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
        // ref={(el) => console.log('__Ref', el)}
        columns={columns}
        sortable
        selectionMode="single"
        getRowId={(item) => item.roleId}
        onSelectionChange={(e, data) => handleChangePersona(data.selectedItems)}
        // resizableColumns
        columnSizingOptions={{
          persona: {
            minWidth: 150,
            defaultWidth: 150,
            idealWidth: 150,
          },
          // summary: {
          //   defaultWidth: 180,
          //   minWidth: 120,
          //   idealWidth: 180,
          // },
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
