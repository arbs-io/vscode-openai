import { IConversation } from '.'

export interface IConversationButtonProps {
  conversation: IConversation
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
}
