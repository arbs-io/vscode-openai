/**
 * This function runs a multistep configuration for vscode-openai
 * 	Steps:
 * 		1 - Select the authentication type
 * 		Store and activate configuration
 */

import { QuickPickItem, ExtensionContext } from 'vscode'
import { MultiStepInput } from '@app/utilities/vscode'
import { ConversationStorageService } from '@app/services'
import { getSystemPersonas } from '@app/models'
import { IConversation } from '@app/types'

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
        label: 'Developer/Programmer',
        detail:
          'Assists with design, develop, and maintain of software applications and systems',
      },
      {
        label: 'System Administrator',
        detail:
          'Assists with managing and maintain computer systems, networks, and servers',
      },
      {
        label: 'Network Engineer',
        detail:
          'Assists with design, implement, and maintain computer networks for organizations',
      },
      {
        label: 'Database Administrator',
        detail:
          'Assists with managing and maintain databases for organizations',
      },
      {
        label: 'IT Manager',
        detail:
          'Assists with technology infrastructure and operations of organizations',
      },
      {
        label: 'Project Manager',
        detail:
          'Assists with planning, execute, and monitor projects related to technology products and services',
      },
      {
        label: 'Business Analysts',
        detail:
          'Assists with analyzing business processes and requirements related to technology products and services',
      },
      {
        label: 'Quality Assurance Testers',
        detail:
          'Assists with testing software applications and systems to ensure quality control',
      },
      {
        label: 'Technical Writer',
        detail:
          'Assists with creating technical documentation such as user manuals, online help, and training materials',
      },
      {
        label: 'User Experience Designers',
        detail:
          'Assists with designing and improve the user experience of software applications and systems',
      },
      {
        label: 'Product Manager',
        detail:
          'Assists with overseeing the development and launch of software products and services',
      },
      {
        label: 'Data Scientist',
        detail:
          'Assists with analyzing and interpret complex data sets to identify patterns and insights',
      },
      {
        label: 'Cyber Security Analysts',
        detail:
          'Assists with protecting computer systems and networks from cyber attacks and security breaches',
      },
      {
        label: 'Cloud Architect',
        detail:
          'Assists with designing and implement cloud computing solutions for organizations',
      },
      {
        label: 'DevOps Engineers',
        detail:
          'Assists with bridging the gap between development and operations teams by automating software delivery processes',
      },
      {
        label: 'Enterprise Architect',
        detail:
          'Assists with designing and oversee the implementation of technology solutions that align with business goals and objectives',
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
