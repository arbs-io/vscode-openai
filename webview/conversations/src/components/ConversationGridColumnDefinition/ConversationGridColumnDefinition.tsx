import {
  TableCellLayout,
  TableColumnDefinition,
  createTableColumn,
  TableCell,
  Avatar,
  PresenceBadgeStatus,
} from '@fluentui/react-components'
import { BriefcaseRegular } from '@fluentui/react-icons'
import { IConversation } from '../../interfaces'
import { vscode } from '../../utilities'

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
        const avatarComponent = getStatus(item) // Call the getStatus function to get the Avatar component
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

function getStatus(item: IConversation) {
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000 // 1 day in milliseconds
  const oneWeekInMilliseconds = 7 * oneDayInMilliseconds // 1 week in milliseconds
  const oneMonthInMilliseconds = 30 * oneDayInMilliseconds // 1 month in milliseconds
  const currentTimestamp = new Date().getTime() // Current timestamp
  const timeDifference = currentTimestamp - item.timestamp

  const size = 36
  // const icon = <BriefcaseRegular />

  let status: PresenceBadgeStatus = 'away'
  let outOfOffice = true

  if (timeDifference > oneMonthInMilliseconds) {
    status = 'away'
    outOfOffice = true
  } else if (timeDifference > oneWeekInMilliseconds) {
    status = 'away'
    outOfOffice = false
  } else if (timeDifference > oneDayInMilliseconds) {
    status = 'available'
    outOfOffice = true
  } else {
    status = 'available'
    outOfOffice = false
  }

  return (
    <Avatar
      badge={{
        status: status,
        outOfOffice: outOfOffice,
        icon: <BriefcaseRegular />,
      }}
      size={size}
      shape="square"
      // icon={icon}
    />
  )
}
