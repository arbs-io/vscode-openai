import { FC } from 'react'
import { MenuItem } from '@fluentui/react-components'
import {
  bundleIcon,
  ClipboardTextLtr24Filled,
  ClipboardTextLtr24Regular,
} from '@fluentui/react-icons'
import { vscode } from '../../utilities/vscode'
import { IConversation, IMenuItemProps } from '../../interfaces'

const handleDownloadConversation = (conversation: IConversation) => {
  vscode.postMessage({
    command: 'onDidOpenMarkdown',
    text: JSON.stringify(conversation),
  })
}

const ClipboardTextIcon = bundleIcon(
  ClipboardTextLtr24Filled,
  ClipboardTextLtr24Regular
)

const MenuItemOpenMarkdown: FC<IMenuItemProps> = ({ conversation }) => {
  return (
    <MenuItem
      icon={<ClipboardTextIcon />}
      onClick={() => handleDownloadConversation(conversation)}
    >
      Open Markdown
    </MenuItem>
  )
}

export default MenuItemOpenMarkdown
