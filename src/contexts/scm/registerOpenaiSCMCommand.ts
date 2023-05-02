// https://github.com/bendera/vscode-commit-message-editor/blob/91ed2bf9c68c4d36cad0f99268e2f4e99083a2e8/src/utils/GitService.ts
import { commands, ExtensionContext } from 'vscode'
import { VSCODE_OPENAI_SCM } from '@app/contexts'
import GitService from '@app/utilities/git/gitService'
import { IChatCompletion, IConversation } from '@app/interfaces'
import { getSystemPersonas } from '@app/models'
import { ConversationService } from '@app/services'
import { createChatCompletion, ResponseFormat } from '@app/utilities/openai'

export function registerOpenaiSCMCommand(context: ExtensionContext) {
  _registerOpenaiSCMCommand(context)
}

function _registerOpenaiSCMCommand(context: ExtensionContext) {
  const gitService = new GitService()
  // gitService.onRepositoryDidChange(handlerRepositoryDidChange)

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

const getGitDifferences = async (
  git: GitService
): Promise<string | undefined> => {
  const repo = git.getSelectedRepository()
  let diff = await repo?.diff(true)
  if (!diff) diff = await repo?.diff(false)
  return diff
}

const getDiffs = async (git: GitService): Promise<string[] | undefined> => {
  const repo = git.getSelectedRepository()
  let diff = await repo?.diff(true)
  if (!diff) diff = await repo?.diff(false)
  return diff?.split('diff --git ')
}

// function handlerRepositoryDidChange(repositoryInfo: {
//   numberOfRepositories: number
//   selectedRepositoryPath: string
//   availableRepositories: string[]
// }): void {
//   showMessageWithTimeout(
//     `${repositoryInfo.numberOfRepositories} - ${repositoryInfo.selectedRepositoryPath}`
//   )
// }
