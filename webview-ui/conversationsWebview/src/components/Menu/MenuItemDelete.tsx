import { FC } from 'react'
import { MenuItem } from '@fluentui/react-components'
import {
  bundleIcon,
  Delete24Filled,
  Delete24Regular,
} from '@fluentui/react-icons'
import { IConversation, IMenuItemProps } from '../../interfaces'
import { vscode } from '../../utilities/vscode'

const handleDeleteConversation = (conversation: IConversation) => {
  vscode.postMessage({
    command: 'onDidConversationDelete',
    text: JSON.stringify(conversation),
  })
}

const DeleteIcon = bundleIcon(Delete24Filled, Delete24Regular)

const MenuItemDelete: FC<IMenuItemProps> = ({ conversation }) => {
  return (
    <MenuItem
      icon={<DeleteIcon />}
      onClick={() => handleDeleteConversation(conversation)}
    >
      Delete
    </MenuItem>
  )
}

export default MenuItemDelete
