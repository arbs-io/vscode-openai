import { FC } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Button,
  mergeClasses,
  Tooltip,
} from '@fluentui/react-components'
import { Delete24Regular } from '@fluentui/react-icons'
import { useStyles } from './useStyles'
import { vscode } from '../../utilities/vscode'
import { IConversation, IConversationButtonProps } from '../../interfaces'

const handleDeleteConversation = (conversation: IConversation) => {
  vscode.postMessage({
    command: 'onDidConversationDelete',
    text: JSON.stringify(conversation),
  })
}

const DeleteButton: FC<IConversationButtonProps> = ({ conversation }) => {
  return (
    <Dialog modalType="alert">
      <DialogTrigger disableButtonEnhancement>
        <Tooltip content="Permanently remove conversation" relationship="label">
          <Button
            size="small"
            shape="rounded"
            className={mergeClasses(useStyles().horizontalPadding)}
            appearance="transparent"
            icon={<Delete24Regular />}
          />
        </Tooltip>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Delete Conversation</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this conversation? Please note that
            this action cannot be undone.
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
  )
}

export default DeleteButton
