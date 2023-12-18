/**
 * This function runs a multistep configuration for vscode-openai
 * 	Steps:
 * 		1 - Select the authentication type
 * 		Store and activate configuration
 */

import {
  QuickPickItem,
  ExtensionContext,
  QuickPickItemKind,
  ThemeIcon,
} from 'vscode'
import { MultiStepInput } from '@app/apis/vscode'
import { ConversationStorageService } from '@app/services'
import { getSystemPersonas } from '@app/models'
import { IConversation } from '@app/types'
import { VSCODE_OPENAI_QP_PERSONA } from '@app/constants'

/**
 * This function sets up a quick pick menu for configuring the OpenAI service provider.
 * @param context - The extension context.
 * @returns void
 */
export async function quickPickCreateConversation(
  _context: ExtensionContext
): Promise<void> {
  interface State {
    title: string
    step: number
    totalSteps: number
    personaQuickPickItem: QuickPickItem
  }

  async function collectInputs() {
    const state = {} as Partial<State>
    await MultiStepInput.run((input) => selectPersona(input, state))
    return state as State
  }

  const title = 'Create Persona Conversation (vscode-openai)'

  /**
   * This function displays a quick pick menu for selecting an OpenAI model and updates the application's state accordingly.
   * @param input - The multi-step input object.
   * @param state - The current state of the application.
   */
  async function selectPersona(
    input: MultiStepInput,
    state: Partial<State>
  ): Promise<void> {
    const models = getAvailablePersonas()
    // Display quick pick menu for selecting an OpenAI model and update application's state accordingly.
    // Return void since this is not used elsewhere in the code.
    state.personaQuickPickItem = await input.showQuickPick({
      title,
      step: 1,
      totalSteps: 1,
      ignoreFocusOut: false,
      placeholder: 'Selected Conversation Persona',
      items: models,
      activeItem: state.personaQuickPickItem,
      shouldResume: shouldResume,
    })
  }

  function getAvailablePersonas(): QuickPickItem[] {
    const quickPickItemTypes: QuickPickItem[] = [
      {
        label: 'Configuration',
        kind: QuickPickItemKind.Separator,
      },
      {
        label: VSCODE_OPENAI_QP_PERSONA.CONFIGURATION,
        iconPath: new ThemeIcon(VSCODE_OPENAI_QP_PERSONA.CONFIGURATION_ICON),
        detail: VSCODE_OPENAI_QP_PERSONA.CONFIGURATION_DESC,
      },
      {
        label: 'Personas',
        kind: QuickPickItemKind.Separator,
      },
      {
        label: VSCODE_OPENAI_QP_PERSONA.DEVELOPER,
        iconPath: new ThemeIcon(VSCODE_OPENAI_QP_PERSONA.DEVELOPER_ICON),
        detail: VSCODE_OPENAI_QP_PERSONA.DEVELOPER_DESC,
      },
      {
        label: VSCODE_OPENAI_QP_PERSONA.SYSTEM_ADMIN,
        iconPath: new ThemeIcon(VSCODE_OPENAI_QP_PERSONA.SYSTEM_ADMIN_ICON),
        detail: VSCODE_OPENAI_QP_PERSONA.SYSTEM_ADMIN_DESC,
      },
      {
        label: VSCODE_OPENAI_QP_PERSONA.NETWORK_ENGINEER,
        iconPath: new ThemeIcon(VSCODE_OPENAI_QP_PERSONA.NETWORK_ENGINEER_ICON),
        detail: VSCODE_OPENAI_QP_PERSONA.NETWORK_ENGINEER_DESC,
      },
      {
        label: VSCODE_OPENAI_QP_PERSONA.DATABASE_ADMIN,
        iconPath: new ThemeIcon(VSCODE_OPENAI_QP_PERSONA.DATABASE_ADMIN_ICON),
        detail: VSCODE_OPENAI_QP_PERSONA.DATABASE_ADMIN_DESC,
      },
      {
        label: VSCODE_OPENAI_QP_PERSONA.IT_MANAGER,
        iconPath: new ThemeIcon(VSCODE_OPENAI_QP_PERSONA.IT_MANAGER_ICON),
        detail: VSCODE_OPENAI_QP_PERSONA.IT_MANAGER_DESC,
      },
      {
        label: VSCODE_OPENAI_QP_PERSONA.PROJECT_MANAGER,
        iconPath: new ThemeIcon(VSCODE_OPENAI_QP_PERSONA.PROJECT_MANAGER_ICON),
        detail: VSCODE_OPENAI_QP_PERSONA.PROJECT_MANAGER_DESC,
      },
      {
        label: VSCODE_OPENAI_QP_PERSONA.BUSINESS_ANALYST,
        iconPath: new ThemeIcon(VSCODE_OPENAI_QP_PERSONA.BUSINESS_ANALYST_ICON),
        detail: VSCODE_OPENAI_QP_PERSONA.BUSINESS_ANALYST_DESC,
      },
      {
        label: VSCODE_OPENAI_QP_PERSONA.QA_TESTER,
        iconPath: new ThemeIcon(VSCODE_OPENAI_QP_PERSONA.QA_TESTER_ICON),
        detail: VSCODE_OPENAI_QP_PERSONA.QA_TESTER_DESC,
      },
      {
        label: VSCODE_OPENAI_QP_PERSONA.TECHNICAL_WRITER,
        iconPath: new ThemeIcon(VSCODE_OPENAI_QP_PERSONA.TECHNICAL_WRITER_ICON),
        detail: VSCODE_OPENAI_QP_PERSONA.TECHNICAL_WRITER_DESC,
      },
      {
        label: VSCODE_OPENAI_QP_PERSONA.USER_EXPERIENCE,
        iconPath: new ThemeIcon(VSCODE_OPENAI_QP_PERSONA.USER_EXPERIENCE_ICON),
        detail: VSCODE_OPENAI_QP_PERSONA.USER_EXPERIENCE_DESC,
      },
      {
        label: VSCODE_OPENAI_QP_PERSONA.PRODUCT_MANAGER,
        iconPath: new ThemeIcon(VSCODE_OPENAI_QP_PERSONA.PRODUCT_MANAGER_ICON),
        detail: VSCODE_OPENAI_QP_PERSONA.PRODUCT_MANAGER_DESC,
      },
      {
        label: VSCODE_OPENAI_QP_PERSONA.DATA_SCIENTIST,
        iconPath: new ThemeIcon(VSCODE_OPENAI_QP_PERSONA.DATA_SCIENTIST_ICON),
        detail: VSCODE_OPENAI_QP_PERSONA.DATA_SCIENTIST_DESC,
      },
      {
        label: VSCODE_OPENAI_QP_PERSONA.CYBER_SECURITY,
        iconPath: new ThemeIcon(VSCODE_OPENAI_QP_PERSONA.CYBER_SECURITY_ICON),
        detail: VSCODE_OPENAI_QP_PERSONA.CYBER_SECURITY_DESC,
      },
      {
        label: VSCODE_OPENAI_QP_PERSONA.CLOUD_ARCHITECT,
        iconPath: new ThemeIcon(VSCODE_OPENAI_QP_PERSONA.CLOUD_ARCHITECT_ICON),
        detail: VSCODE_OPENAI_QP_PERSONA.CLOUD_ARCHITECT_DESC,
      },
      {
        label: VSCODE_OPENAI_QP_PERSONA.DEVOPS_ENGINEERS,
        iconPath: new ThemeIcon(VSCODE_OPENAI_QP_PERSONA.DEVOPS_ENGINEERS_ICON),
        detail: VSCODE_OPENAI_QP_PERSONA.DEVOPS_ENGINEERS_DESC,
      },
      {
        label: VSCODE_OPENAI_QP_PERSONA.ENTERPRISE_ARCHITECT,
        iconPath: new ThemeIcon(
          VSCODE_OPENAI_QP_PERSONA.ENTERPRISE_ARCHITECT_ICON
        ),
        detail: VSCODE_OPENAI_QP_PERSONA.ENTERPRISE_ARCHITECT_DESC,
      },
    ]
    return quickPickItemTypes
  }

  function shouldResume() {
    // Could show a notification with the option to resume.
    return new Promise<boolean>((_resolve, _reject) => {
      /* noop */
    })
  }

  //Start openai.com configuration processes
  const state = await collectInputs()
  const persona = getSystemPersonas().find(
    (a) => a.roleName === state.personaQuickPickItem.label
  )!
  const conversation: IConversation =
    await ConversationStorageService.instance.create(persona)
  ConversationStorageService.instance.update(conversation)
  ConversationStorageService.instance.show(conversation.conversationId)
}
