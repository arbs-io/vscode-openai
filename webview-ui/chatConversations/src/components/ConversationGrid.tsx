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
import { columns } from './ConversationGrid/TableColumnDefinition'
import { useStyles } from './ConversationGrid/useStyles'
import { IConversation } from '@appInterfaces/IConversation'

interface IData {
  conversations: IConversation[]
}

const ConversationGrid: FC<IData> = ({ conversations }) => {
  return (
    <DataGrid
      size="extra-small"
      items={conversations}
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
