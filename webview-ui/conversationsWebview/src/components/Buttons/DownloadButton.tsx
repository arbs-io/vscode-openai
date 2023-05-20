import { FC } from 'react'
import { Button, mergeClasses, Tooltip } from '@fluentui/react-components'
import { ArrowDownload24Regular } from '@fluentui/react-icons'
import { useStyles } from './useStyles'
import { vscode } from '../../utilities/vscode'
import { IConversation, IConversationButtonProps } from '../../interfaces'

const handleOpenConversation = (conversation: IConversation) => {
  vscode.postMessage({
    command: 'onDidConversationDownload',
    text: JSON.stringify(conversation),
  })
}

const DownloadButton: FC<IConversationButtonProps> = ({ conversation }) => {
  return (
    <Tooltip content="View conversation" relationship="label">
      <Button
        size="small"
        shape="rounded"
        className={mergeClasses(useStyles().horizontalPadding)}
        appearance="transparent"
        icon={<ArrowDownload24Regular />}
        onClick={() => handleOpenConversation(conversation)}
      />
    </Tooltip>
  )
}

export default DownloadButton
