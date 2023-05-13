import { commands, ExtensionContext } from 'vscode'
import { VSCODE_OPENAI_SCM } from '@app/contexts'
import GitService from '@app/utilities/git/gitService'
import { IChatCompletion, IConversation } from '@app/interfaces'
import { getSystemPersonas } from '@app/models'
import { ConversationService } from '@app/services'
import { createChatCompletion, ResponseFormat } from '@app/utilities/openai'
import { logInfo, logWarning } from '@app/utilities/vscode'
import { sendTelemetryError } from '@app/utilities/node'

// This function registers the Openai SCM command with VS Code.
// It takes an ExtensionContext object as input and does not return anything.
export function registerOpenaiSCMCommand(context: ExtensionContext) {
  try {
    _registerOpenaiSCMCommand(context)
  } catch (error) {
    sendTelemetryError(error)
  }
}

// This is a helper function for registerOpenaiSCMCommand.
// It takes an ExtensionContext object as input and does not return anything.
function _registerOpenaiSCMCommand(context: ExtensionContext) {
  const gitService = new GitService()

  if (gitService.isAvailable()) {
    commands.executeCommand(
      'setContext',
      VSCODE_OPENAI_SCM.ENABLED_COMMAND_ID,
      true
    )
    logInfo('scm vscode.git ready')
  } else {
    logWarning('scm feature disabled vscode.git not found')
  }

  context.subscriptions.push(
    commands.registerCommand(VSCODE_OPENAI_SCM.COMMENT_COMMAND_ID, async () => {
      const differences = await getGitDifferences(gitService)
      if (differences) {
        const comments = await getComments(differences)
        gitService.setSCMInputBoxMessage(comments)
      }
    })
  )
}

// This function generates comments for the given git differences using OpenAI's chatbot API.
// It takes a string representing the git differences as input and returns a Promise that resolves to a string.
const getComments = async (diff: string): Promise<string> => {
  const persona = getSystemPersonas().find(
    (a) => a.roleName === 'Developer/Programmer'
  )
  if (persona) {
    const conversation: IConversation =
      ConversationService.instance.create(persona)

    const prompt = [
      'Each line should be less than 72 characters.',
      'Use the following format:',
      'The changes made in this commit include:',
      '- Added [file name]',
      '- Modified [file name] to [brief description of change]',
      '- Deleted [file name]',
      'Please summarise the following git diff',
      diff,
    ].join('\n')

    const chatCompletion: IChatCompletion = {
      content: prompt,
      author: 'vscode-openai-editor',
      timestamp: new Date().toLocaleString(),
      mine: false,
      completionTokens: 0,
      promptTokens: 0,
      totalTokens: 0,
    }
    conversation.chatMessages.push(chatCompletion)
    const result = await createChatCompletion(
      conversation,
      ResponseFormat.SourceCode
    )
    return result?.content ? result?.content : ''
  }
  return ''
}

// This function retrieves the git differences for the selected repository and returns them as a string.
// It takes a GitService object as input and returns a Promise that resolves to a string or undefined.
const getGitDifferences = async (
  git: GitService
): Promise<string | undefined> => {
  const repo = git.getSelectedRepository()
  let diff = await repo?.diff(true)
  if (!diff) diff = await repo?.diff(false)
  return diff
}
