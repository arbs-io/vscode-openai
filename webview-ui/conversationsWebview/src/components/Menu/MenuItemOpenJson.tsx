import { FC } from 'react'
import { MenuItem } from '@fluentui/react-components'
import {
  bundleIcon,
  ClipboardCode24Filled,
  ClipboardCode24Regular,
} from '@fluentui/react-icons'
import { vscode } from '../../utilities/vscode'
import { IConversation, IMenuItemProps } from '../../interfaces'

const handleOpenConversation = (conversation: IConversation) => {
  vscode.postMessage({
    command: 'onDidOpenConversationJson',
    text: JSON.stringify(conversation),
  })
}

const ClipboardCodeIcon = bundleIcon(
  ClipboardCode24Filled,
  ClipboardCode24Regular
)

const MenuItemOpenJson: FC<IMenuItemProps> = ({ conversation }) => {
  return (
    <MenuItem
      icon={<ClipboardCodeIcon />}
      onClick={() => handleOpenConversation(conversation)}
    >
      Open JSON
    </MenuItem>
  )
}

export default MenuItemOpenJson
