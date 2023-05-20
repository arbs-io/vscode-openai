import { FC } from 'react'
import { MenuItem } from '@fluentui/react-components'
import {
  bundleIcon,
  ArrowDownload24Filled,
  ArrowDownload24Regular,
} from '@fluentui/react-icons'
import { vscode } from '../../utilities/vscode'
import { IConversation, IMenuItemProps } from '../../interfaces'

const handleDownloadConversation = (conversation: IConversation) => {
  vscode.postMessage({
    command: 'onDidConversationDownload',
    text: JSON.stringify(conversation),
  })
}

const ArrowDownloadIcon = bundleIcon(
  ArrowDownload24Filled,
  ArrowDownload24Regular
)

const DownloadMenuItem: FC<IMenuItemProps> = ({ conversation }) => {
  return (
    <MenuItem
      icon={<ArrowDownloadIcon />}
      onClick={() => handleDownloadConversation(conversation)}
    >
      Download
    </MenuItem>
  )
}

export default DownloadMenuItem
