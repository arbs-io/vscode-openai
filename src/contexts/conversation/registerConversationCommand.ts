import { commands, ExtensionContext, window } from 'vscode'
import { VSCODE_OPENAI_CONVERSATION } from '@app/constants'
import { createErrorNotification } from '@app/utilities/node'
import { IConversation } from '@app/interfaces'
import { ConversationStorageService } from '@app/services'
import { getSystemPersonas } from '@app/models'
import { quickPickCreateConversation } from '@app/quickPicks'
import { CommandManager } from '../commandManager'
import { CopyClipboardSummaryCommand } from './copyClipboardSummaryCommand'

export function registerConversationCommand(context: ExtensionContext) {
  try {
    _registerConversationNewDefaultCommand(context)
    _registerConversationNewPersonaCommand(context)
    _registerConversationRefresh(context)
    _registerConversationDeleteAll(context)

    const commandManager = new CommandManager()
    commandManager.register(new CopyClipboardSummaryCommand())
  } catch (error) {
    createErrorNotification(error)
  }
}

function _registerConversationNewDefaultCommand(context: ExtensionContext) {
  try {
    context.subscriptions.push(
      commands.registerCommand(
        VSCODE_OPENAI_CONVERSATION.NEW_STANDARD_COMMAND_ID,
        async () => {
          const persona = getSystemPersonas().find(
            (a) => a.roleName === 'General Chat'
          )!
          const conversation: IConversation =
            await ConversationStorageService.instance.create(persona)
          ConversationStorageService.instance.update(conversation)
          ConversationStorageService.instance.show(conversation.conversationId)
        }
      )
    )
  } catch (error) {
    createErrorNotification(error)
  }
}

function _registerConversationNewPersonaCommand(context: ExtensionContext) {
  try {
    context.subscriptions.push(
      commands.registerCommand(
        VSCODE_OPENAI_CONVERSATION.NEW_PERSONA_COMMAND_ID,
        () => {
          quickPickCreateConversation(context)
        }
      )
    )
  } catch (error) {
    createErrorNotification(error)
  }
}

function _registerConversationRefresh(context: ExtensionContext) {
  try {
    context.subscriptions.push(
      commands.registerCommand(
        VSCODE_OPENAI_CONVERSATION.REFRESH_COMMAND_ID,
        () => {
          ConversationStorageService.instance.refresh()
        }
      )
    )
  } catch (error) {
    createErrorNotification(error)
  }
}
function _registerConversationDeleteAll(context: ExtensionContext) {
  try {
    context.subscriptions.push(
      commands.registerCommand(
        VSCODE_OPENAI_CONVERSATION.DELETE_ALL_COMMAND_ID,
        () => {
          window
            .showInformationMessage(
              'Are you sure you want to delete ALL conversation?',
              'Yes',
              'No'
            )
            .then((answer) => {
              if (answer === 'Yes') {
                ConversationStorageService.instance.deleteAll()
              }
            })
        }
      )
    )
  } catch (error) {
    createErrorNotification(error)
  }
}

// function _registerCopyClipboardSummary(context: ExtensionContext) {
//   try {
//     context.subscriptions.push(
//       commands.registerCommand(
//         'vscode-openai.conversation.clipboard-summary',
//         () => {
//           window
//             .showInformationMessage(
//               'Are you sure you want to delete ALL conversation?',
//               'Yes',
//               'No'
//             )
//             .then((answer) => {
//               if (answer === 'Yes') {
//                 // ConversationStorageService.instance.deleteAll()
//               }
//             })
//         }
//       )
//     )
//   } catch (error) {
//     createErrorNotification(error)
//   }
// }
