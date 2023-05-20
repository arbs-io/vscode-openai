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
import { IConversation, IConversationButtonProps } from '../../interfaces'
import { DownloadMenuItem, OpenMenuItem, DeleteMenuItem } from '.'
import { vscode } from '../../utilities/vscode'

const handleDeleteConversation = (conversation: IConversation) => {
  vscode.postMessage({
    command: 'onDidConversationDelete',
    text: JSON.stringify(conversation),
  })
}

const ContextMenu: FC<IConversationButtonProps> = ({ conversation }) => {
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
      <Dialog
        modalType="alert"
        open={showDelete}
        onOpenChange={(event, data) => setShowDelete(data.open)}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Delete Conversation</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this conversation? Please note
              that this action cannot be undone.
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancel</Button>
              </DialogTrigger>
              <DialogTrigger disableButtonEnhancement>
                <Button
                  className={mergeClasses(useStyles().dangerButton)}
                  onClick={() => handleDeleteConversation(conversation)}
                >
                  Delete
                </Button>
              </DialogTrigger>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}
export default ContextMenu
