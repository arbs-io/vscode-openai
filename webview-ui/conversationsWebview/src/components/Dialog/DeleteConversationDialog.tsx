import { FC } from 'react'
import {
  Button,
  mergeClasses,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
} from '@fluentui/react-components'
import { useStyles } from './useStyles'
import { IConversation, IDialogProps } from '../../interfaces'
import { vscode } from '../../utilities/vscode'

const handleDeleteConversation = (conversation: IConversation) => {
  vscode.postMessage({
    command: 'onDidConversationDelete',
    text: JSON.stringify(conversation),
  })
}

const DeleteConversationDialog: FC<IDialogProps> = ({
  showDialog,
  setShowDialog,
  conversation,
}) => {
  return (
    <Dialog modalType="alert" open={showDialog}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Delete Conversation</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this conversation? Please note that
            this action cannot be undone.
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button
                appearance="secondary"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </Button>
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
export default DeleteConversationDialog
