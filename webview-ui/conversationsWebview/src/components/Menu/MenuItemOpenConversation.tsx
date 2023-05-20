import { FC } from 'react'
import { MenuItem } from '@fluentui/react-components'
import { bundleIcon, Open24Filled, Open24Regular } from '@fluentui/react-icons'
import { vscode } from '../../utilities/vscode'
import { IConversation, IMenuItemProps } from '../../interfaces'

const handleOpenConversation = (conversation: IConversation) => {
  vscode.postMessage({
    command: 'onDidOpenConversation',
    text: JSON.stringify(conversation),
  })
}

const OpenIcon = bundleIcon(Open24Filled, Open24Regular)

const MenuItemOpenConversation: FC<IMenuItemProps> = ({ conversation }) => {
  return (
    <MenuItem
      icon={<OpenIcon />}
      onClick={() => handleOpenConversation(conversation)}
    >
      Open Conversation
    </MenuItem>
  )
}

export default MenuItemOpenConversation
