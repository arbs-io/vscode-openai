import { ConversationGridColumnDefinition } from '@app/components/ConversationGridColumnDefinition';
import { IConversation } from '@app/interfaces';
import { vscode } from '@app/utilities';
import {
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  makeStyles,
  mergeClasses,
} from '@fluentui/react-components';
import { FC, useCallback, useEffect, useState } from 'react';

const useStyles = makeStyles({
  conversations: {
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    cursor: 'context-menu',
    fontFamily: 'var(--vscode-font-family)',
    fontSize: 'var(--vscode-font-size)',
    color: 'var(--vscode-editor-foreground)',
  },
})

const ConversationGrid: FC = () => {
  const styles = useStyles()
  const [didInitialize, setDidInitialize] = useState<boolean>(false)
  const [state, setState] = useState<MessageEvent>()
  const [conversations, setConversations] = useState<IConversation[]>([])

  const onMessageReceivedFromIframe = useCallback(
    (event: MessageEvent) => {
      if (event.data.command === 'onWillConversationsLoad') {
        const rcvConversations: IConversation[] = JSON.parse(event.data.text)
        setConversations(rcvConversations)
        console.log(rcvConversations)
      }
      setState(event)
    },
    [state]
  )

  // const handleContextMenu = (event: React.MouseEvent, conversation: IConversation) => {
  //   event.preventDefault()
  //   vscode.postMessage({
  //     command: 'onContextMenu',
  //     text: JSON.stringify(conversation),
  //   })
  // }

  useEffect(() => {
    window.addEventListener('message', onMessageReceivedFromIframe)

    if (!didInitialize) {
      vscode.postMessage({
        command: 'onDidInitialize',
        text: undefined,
      })
      setDidInitialize(true)
    }

    return () =>
      window.removeEventListener('message', onMessageReceivedFromIframe)
  }, [onMessageReceivedFromIframe])

  return (
    <div
      style={{
        overflowY: 'auto',
        scrollbarColor: 'var(--vscode-scrollbarSlider-background) var(--vscode-scrollbarSlider-hoverBackground)',
        scrollbarWidth: 'thin',
      }}
    >
      <DataGrid
        size="extra-small"
        items={conversations}
        columns={ConversationGridColumnDefinition}
        getRowId={(item) => item.itemId}
        resizableColumns
        columnSizingOptions={{
          persona: {
            minWidth: 35,
            defaultWidth: 35,
            idealWidth: 35,
          },
        }}
      >
        <DataGridHeader>
          <DataGridRow>
            {({ renderHeaderCell }) => (
              <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<IConversation>>
          {({ item, rowId }) => (
            <DataGridRow<IConversation>
              key={rowId}
              className={mergeClasses(styles.conversations)}
              data-vscode-context={JSON.stringify({
                webviewSection: 'conversation',
                data: item,
              })}
            >
              {({ renderCell }) => (
                <DataGridCell>{renderCell(item)}</DataGridCell>
              )}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
    </div>
  )
}

export default ConversationGrid
