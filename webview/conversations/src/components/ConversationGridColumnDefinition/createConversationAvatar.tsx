import { useContext } from 'react'
import { Avatar, PresenceBadgeStatus } from '@fluentui/react-components'
import { BriefcaseRegular } from '@fluentui/react-icons'
import { IConversation } from '../../interfaces'
import { iconAccount } from '../../assets'
import { ThemeContext } from '../../context'

function createConversationAvatar(item: IConversation): JSX.Element {
  const theme = useContext(ThemeContext)
  console.log(theme?.isDarkMode, item.persona.roleName)

  const oneDayInMilliseconds = 24 * 60 * 60 * 1000 // 1 day in milliseconds
  const oneWeekInMilliseconds = 7 * oneDayInMilliseconds // 1 week in milliseconds
  const oneMonthInMilliseconds = 30 * oneDayInMilliseconds // 1 month in milliseconds
  const currentTimestamp = new Date().getTime() // Current timestamp
  const timeDifference = currentTimestamp - item.timestamp
  const size = 36
  let status: PresenceBadgeStatus = 'away'
  let outOfOffice = true
  switch (true) {
    case timeDifference > oneMonthInMilliseconds:
      status = 'away'
      outOfOffice = true
      break
    case timeDifference > oneWeekInMilliseconds:
      status = 'away'
      outOfOffice = false
      break
    case timeDifference > oneDayInMilliseconds:
      status = 'available'
      outOfOffice = true
      break
    default:
      status = 'available'
      outOfOffice = false
      break
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
      image={{ as: 'img', src: iconAccount() }}
    />
  )
}

export default createConversationAvatar

// function getIcon(abc: string): string {
//   switch (abc) {
//     case 'General Chat':
//       return 'comment'
//     case 'Developer/Programmer':
//       return 'debug-console'
//     case 'System Administrator':
//       return 'console'
//     case 'Network Engineer':
//       return 'type-hierarchy'
//     case 'Database Administrator':
//       return 'database'
//     case 'IT Manager':
//       return 'coffee'
//     case 'Project Manager':
//       return 'account'
//     case 'Business Analysts':
//       return 'telescope'
//     case 'Quality Assurance Testers':
//       return 'bug'
//     case 'Technical Writer':
//       return 'word-wrap'
//     case 'User Experience Designers':
//       return 'tag'
//     case 'Product Manager':
//       return 'folder-active'
//     case 'Data Scientist':
//       return 'combine'
//     case 'Cyber Security Analysts':
//       return 'workspace-trusted'
//     case 'Cloud Architect':
//       return 'cloud'
//     case 'DevOps Engineers':
//       return 'circuit-board'
//     case 'Enterprise Architect':
//       return 'organization'
//     default:
//       return ''
//   }
// }
