import { FC } from 'react'
import {
  Button,
  Menu,
  MenuTrigger,
  MenuList,
  MenuItem,
  MenuPopover,
  mergeClasses,
} from '@fluentui/react-components'
import {
  bundleIcon,
  MoreHorizontal24Regular,
  Delete24Regular,
  Delete24Filled,
  ArrowDownload24Regular,
  ArrowDownload24Filled,
  Open24Regular,
  Open24Filled,
} from '@fluentui/react-icons'
import { useStyles } from './useStyles'
import { IConversationButtonProps } from '../../interfaces'

const OpenIcon = bundleIcon(Open24Filled, Open24Regular)
const ArrowDownloadIcon = bundleIcon(
  ArrowDownload24Filled,
  ArrowDownload24Regular
)
const DeleteIcon = bundleIcon(Delete24Filled, Delete24Regular)

const ContextMenuButton: FC<IConversationButtonProps> = ({ conversation }) => {
  return (
    <Menu openOnHover={true}>
      <MenuTrigger disableButtonEnhancement>
        <Button
          size="small"
          shape="rounded"
          className={mergeClasses(useStyles().horizontalPadding)}
          appearance="transparent"
          icon={<MoreHorizontal24Regular />}
        />
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          <MenuItem icon={<OpenIcon />}>Open</MenuItem>
          <MenuItem icon={<ArrowDownloadIcon />}>Download</MenuItem>
          <MenuItem icon={<DeleteIcon />}>Delete</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  )
}
export default ContextMenuButton
