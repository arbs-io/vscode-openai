import { FC, useState } from 'react'
import {
  Button,
  Menu,
  MenuTrigger,
  MenuList,
  MenuPopover,
  mergeClasses,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
} from '@fluentui/react-components'
import { MoreHorizontal24Regular } from '@fluentui/react-icons'
import { useStyles } from './useStyles'
import { IConversation, IMenuItemProps } from '../../interfaces'
import { DownloadMenuItem, OpenMenuItem, DeleteMenuItem } from '.'
import { vscode } from '../../utilities/vscode'
import { DeleteConversationDialog } from '../Dialog'

const handleDeleteConversation = (conversation: IConversation) => {
  vscode.postMessage({
    command: 'onDidConversationDelete',
    text: JSON.stringify(conversation),
  })
}

const ContextMenu: FC<IMenuItemProps> = ({ conversation }) => {
  const [showDelete, setShowDelete] = useState(false)
  return (
    <>
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
            <OpenMenuItem conversation={conversation} />
            <DownloadMenuItem conversation={conversation} />
            <DeleteMenuItem
              onClick={() => setShowDelete(true)}
              conversation={conversation}
            />
          </MenuList>
        </MenuPopover>
      </Menu>
      <DeleteConversationDialog
        showDialog={showDelete}
        setShowDialog={setShowDelete}
        conversation={conversation}
      />
    </>
  )
}
export default ContextMenu
