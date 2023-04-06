import { FC } from 'react'
import {
  DataGridBody,
  DataGridRow,
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridCell,
  mergeClasses,
} from '@fluentui/react-components'
import { columns } from './TableColumnDefinition'
import { useStyles } from './useStyles'
import { IConversation } from '../../interfaces'
import IData from './IData'

const ConversationGrid: FC<IData> = ({ conversations }) => {
  return (
    <DataGrid
      size="extra-small"
      items={conversations}
      columns={columns}
      getRowId={(item) => item.itemId}
      resizableColumns
      columnSizingOptions={{
        persona: {
          minWidth: 30,
          defaultWidth: 30,
          idealWidth: 30,
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
      <DataGridBody<IConversation>>
        {({ item, rowId }) => (
          <DataGridRow<IConversation>
            key={rowId}
            className={mergeClasses(useStyles().verticalPadding)}
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

export default ConversationGrid
