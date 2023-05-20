import { FC } from 'react'
import { MenuItem } from '@fluentui/react-components'
import { bundleIcon, Open24Filled, Open24Regular } from '@fluentui/react-icons'
import { vscode } from '../../utilities/vscode'
import { IConversation, IConversationButtonProps } from '../../interfaces'

const handleOpenConversation = (conversation: IConversation) => {
  vscode.postMessage({
    command: 'onDidConversationOpen',
    text: JSON.stringify(conversation),
  })
}

const OpenIcon = bundleIcon(Open24Filled, Open24Regular)

const OpenMenuItem: FC<IConversationButtonProps> = ({ conversation }) => {
  return (
    <MenuItem
      icon={<OpenIcon />}
      onClick={() => handleOpenConversation(conversation)}
    >
      Open
    </MenuItem>
  )
}

export default OpenMenuItem
