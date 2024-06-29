import { Avatar, PresenceBadgeStatus } from '@fluentui/react-components'
import { IConversation } from '@app/interfaces'
import {
  ProjectManagerIcon,
  GeneralChatIcon,
  DeveloperProgrammerIcon,
  NetworkEngineerIcon,
  DatabaseAdministratorIcon,
  BusinessAnalystsIcon,
  ITManagerIcon,
  QualityAssuranceTestersIcon,
  TechnicalWriterIcon,
  UserExperienceDesignersIcon,
  ProductManagerIcon,
  DataScientistIcon,
  CyberSecurityAnalystsIcon,
  CloudArchitectIcon,
  DevOpsEngineersIcon,
  EnterpriseArchitectIcon,
  SystemAdministratorIcon,
} from '@app/assets'
import { useContext } from 'react'
import { ThemeContext } from '@app/context'

function useConversationAvatar(item: IConversation): JSX.Element {
  const theme = useContext(ThemeContext)
  const fillColor: string = theme?.isDarkMode ? '#ffffff' : '#000000'
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000 // 1 day in milliseconds
  const oneWeekInMilliseconds = 7 * oneDayInMilliseconds // 1 week in milliseconds
  const oneMonthInMilliseconds = 30 * oneDayInMilliseconds // 1 month in milliseconds
  const currentTimestamp = new Date().getTime() // Current timestamp
  const timeDifference = currentTimestamp - item.timestamp

  const size = 28
  const personaIcon = getPersonaIcon(item.persona.roleName, fillColor)
  let status: PresenceBadgeStatus = 'away'
  let outOfOffice = true

  switch (true) {
    case timeDifference > oneMonthInMilliseconds:
      break

    case timeDifference > oneWeekInMilliseconds:
      outOfOffice = false
      break

    case timeDifference > oneDayInMilliseconds:
      status = 'available'
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
      }}
      size={size}
      shape="square"
      image={{ as: 'img', src: personaIcon }}
    />
  )
}

export default useConversationAvatar

function getPersonaIcon(personaRoleName: string, fillColor: string): string {
  switch (personaRoleName) {
    case 'General Chat':
      return GeneralChatIcon(fillColor)
    case 'Developer/Programmer':
      return DeveloperProgrammerIcon(fillColor)
    case 'System Administrator':
      return SystemAdministratorIcon(fillColor)
    case 'Network Engineer':
      return NetworkEngineerIcon(fillColor)
    case 'Database Administrator':
      return DatabaseAdministratorIcon(fillColor)
    case 'IT Manager':
      return ITManagerIcon(fillColor)
    case 'Project Manager':
      return ProjectManagerIcon(fillColor)
    case 'Business Analysts':
      return BusinessAnalystsIcon(fillColor)
    case 'Quality Assurance Testers':
      return QualityAssuranceTestersIcon(fillColor)
    case 'Technical Writer':
      return TechnicalWriterIcon(fillColor)
    case 'User Experience Designers':
      return UserExperienceDesignersIcon(fillColor)
    case 'Product Manager':
      return ProductManagerIcon(fillColor)
    case 'Data Scientist':
      return DataScientistIcon(fillColor)
    case 'Cyber Security Analysts':
      return CyberSecurityAnalystsIcon(fillColor)
    case 'Cloud Architect':
      return CloudArchitectIcon(fillColor)
    case 'DevOps Engineers':
      return DevOpsEngineersIcon(fillColor)
    case 'Enterprise Architect':
      return EnterpriseArchitectIcon(fillColor)
    default:
      return GeneralChatIcon(fillColor)
  }
}
