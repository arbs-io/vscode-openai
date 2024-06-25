import { IConversation } from './IConversation'

export interface IDialogProps {
  showDialog: boolean
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>
  conversation: IConversation
}
