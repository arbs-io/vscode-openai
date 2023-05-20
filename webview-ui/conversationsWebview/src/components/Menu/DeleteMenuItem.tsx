import { FC } from 'react'
import { MenuItem } from '@fluentui/react-components'
import {
  bundleIcon,
  Delete24Filled,
  Delete24Regular,
} from '@fluentui/react-icons'
import { IConversationButtonProps } from '../../interfaces'

const DeleteIcon = bundleIcon(Delete24Filled, Delete24Regular)

const DeleteMenuItem: FC<IConversationButtonProps> = ({ onClick }) => {
  return (
    <MenuItem icon={<DeleteIcon />} onClick={onClick}>
      Delete
    </MenuItem>
  )
}

export default DeleteMenuItem
