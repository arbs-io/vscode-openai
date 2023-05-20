import { FC, useState } from 'react'
import {
  Button,
  Menu,
  MenuTrigger,
  MenuList,
  MenuPopover,
  mergeClasses,
} from '@fluentui/react-components'
import { MoreHorizontal24Regular } from '@fluentui/react-icons'
import { useStyles } from './useStyles'
import { IConversation, IMenuItemProps } from '../../interfaces'
import {
  MenuItemOpenConversation,
  MenuItemOpenMarkdown,
  MenuItemOpenJson,
  MenuItemDelete,
} from '.'
import { DeleteConversationDialog } from '../Dialog'

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
            <MenuItemOpenConversation conversation={conversation} />
            <MenuItemOpenMarkdown conversation={conversation} />
            <MenuItemOpenJson conversation={conversation} />
            <MenuItemDelete
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
