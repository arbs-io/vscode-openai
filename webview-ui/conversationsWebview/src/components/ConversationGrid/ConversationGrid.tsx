import { FC } from 'react'
import {
  DataGridBody,
  DataGridRow,
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridCell,
  mergeClasses,
  makeStyles,
} from '@fluentui/react-components'
import { ConversationGridColumnDefinition } from '../ConversationGridColumnDefinition'
import { IConversation, IConversationGridProps } from '../../interfaces'

const componentStyles = makeStyles({
  verticalPadding: {
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
    cursor: 'context-menu',
  },
  horizontalPadding: {
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
    cursor: 'context-menu',
  },
})

const ConversationGrid: FC<IConversationGridProps> = ({ conversations }) => {
  return (
    <DataGrid
      size="extra-small"
      items={conversations}
      columns={ConversationGridColumnDefinition}
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
            className={mergeClasses(componentStyles().verticalPadding)}
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
