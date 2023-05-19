import { FC } from 'react'
import { Button, mergeClasses, Tooltip } from '@fluentui/react-components'
import { Open24Regular } from '@fluentui/react-icons'
import { useStyles } from './useStyles'
import { vscode } from '../../utilities/vscode'
import { IConversation, IConversationButtonProps } from '../../interfaces'

const handleOpenConversation = (conversation: IConversation) => {
  vscode.postMessage({
    command: 'onDidConversationOpen',
    text: JSON.stringify(conversation),
  })
}

const ButtonOpen: FC<IConversationButtonProps> = ({ conversation }) => {
  return (
    <Tooltip content="View conversation" relationship="label">
      <Button
        size="small"
        shape="rounded"
        className={mergeClasses(useStyles().horizontalPadding)}
        appearance="transparent"
        icon={<Open24Regular />}
        onClick={() => handleOpenConversation(conversation)}
      />
    </Tooltip>
  )
}

export default ButtonOpen
