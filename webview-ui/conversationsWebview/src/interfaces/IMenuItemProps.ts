import { IConversation } from '.'

export interface IMenuItemProps {
  conversation: IConversation
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
}
