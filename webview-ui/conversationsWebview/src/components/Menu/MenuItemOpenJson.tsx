import { FC } from 'react'
import { MenuItem } from '@fluentui/react-components'
import {
  bundleIcon,
  ClipboardCode24Filled,
  ClipboardCode24Regular,
} from '@fluentui/react-icons'
import { vscode } from '../../utilities/vscode'
import { IConversation, IMenuItemProps } from '../../interfaces'

const handleDownloadConversation = (conversation: IConversation) => {
  vscode.postMessage({
    command: 'onDidOpenJson',
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
      onClick={() => handleDownloadConversation(conversation)}
    >
      Download JSON
    </MenuItem>
  )
}

export default MenuItemOpenJson
