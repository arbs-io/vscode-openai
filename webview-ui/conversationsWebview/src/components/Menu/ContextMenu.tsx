import { FC } from 'react'
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
import { IMenuItemProps } from '../../interfaces'
import {
  MenuItemOpenConversation,
  MenuItemOpenMarkdown,
  MenuItemOpenJson,
  MenuItemDelete,
} from '.'

const ContextMenu: FC<IMenuItemProps> = ({ conversation }) => {
  return (
    <>
      <Menu>
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
            <MenuItemDelete conversation={conversation} />
          </MenuList>
        </MenuPopover>
      </Menu>
    </>
  )
}
export default ContextMenu
