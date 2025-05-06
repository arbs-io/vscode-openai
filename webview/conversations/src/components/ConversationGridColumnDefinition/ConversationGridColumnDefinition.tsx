import { IConversation } from '@app/interfaces';
import { vscode } from '@app/utilities';
import {
  createTableColumn,
  TableCell,
  TableCellLayout,
  TableColumnDefinition,
} from '@fluentui/react-components';
import useConversationAvatar from './useConversationAvatar';

const handleOpenConversation = (conversation: IConversation) => {
  vscode.postMessage({
    command: 'onDidOpenConversationWebview',
    text: JSON.stringify(conversation),
  })
}

const ConversationGridColumnDefinition: TableColumnDefinition<IConversation>[] =
  [
    createTableColumn<IConversation>({
      columnId: 'persona',
      compare: (a, b) => {
        return a.timestamp - b.timestamp
      },
      renderHeaderCell: () => {
        return ''
      },
      renderCell: (item) => {
        const avatarComponent = useConversationAvatar(item) // Call the getStatus function to get the Avatar component
        return (
          <div id="personadiv">
            <TableCell tabIndex={0}>
              <TableCellLayout media={avatarComponent} />
            </TableCell>
          </div>
        )
      },
    }),
    createTableColumn<IConversation>({
      columnId: 'summary',
      compare: (a, b) => {
        return a.timestamp - b.timestamp
      },
      renderHeaderCell: () => {
        return 'Summary'
      },
      renderCell: (conversation) => {
        return (
          <TableCell tabIndex={0}>
            <TableCellLayout
              description={conversation.summary}
              onClick={() => handleOpenConversation(conversation)}
              style={{ cursor: 'pointer' }}
            />
          </TableCell>
        )
      },
    }),
  ]
export default ConversationGridColumnDefinition
