import { commands, ExtensionContext, window } from 'vscode'
import { VSCODE_OPENAI_CONVERSATION } from '@app/contexts'
import { createErrorNotification } from '@app/utilities/node'

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
        VSCODE_OPENAI_CONVERSATION.NEW_DEFAULT_COMMAND_ID,
        () => {
          window.showInformationMessage(
            `_registerConversationNewDefaultCommand.`
          )
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
          window.showInformationMessage(
            `_registerConversationNewPersonaCommand.`
          )
        }
      )
    )
  } catch (error) {
    createErrorNotification(error)
  }
}
