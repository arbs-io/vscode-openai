import { commands, ExtensionContext, window } from 'vscode'
import { VSCODE_OPENAI_CONVERSATION } from '@app/contexts'
import { createErrorNotification } from '@app/utilities/node'
import { IConversation } from '@app/interfaces'
import { ConversationService } from '@app/services'
import { getSystemPersonas } from '@app/models'
import { quickPickCreateConversation } from '@app/quickPick'

export function registerConversationCommand(context: ExtensionContext) {
  try {
    _registerConversationNewDefaultCommand(context)
    _registerConversationNewPersonaCommand(context)
  } catch (error) {
    createErrorNotification(error)
  }
}

function _registerConversationNewDefaultCommand(context: ExtensionContext) {
  try {
    context.subscriptions.push(
      commands.registerCommand(
        VSCODE_OPENAI_CONVERSATION.NEW_STANDARD_COMMAND_ID,
        () => {
          const persona = getSystemPersonas().find(
            (a) => a.roleName === 'General Chat'
          )!
          const conversation: IConversation =
            ConversationService.instance.create(persona)
          ConversationService.instance.update(conversation)
          ConversationService.instance.show(conversation.conversationId)
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
