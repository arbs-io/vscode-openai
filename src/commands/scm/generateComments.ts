import { Command } from '@app/commands'
import { GitService, getComments, getGitDifferences } from '@app/apis/git'
import {
  createErrorNotification,
  createDebugNotification,
} from '@app/apis/node'

export default class GenerateCommentsCommand implements Command {
  public readonly id = '_vscode-openai.scm.generate.comments'

  public async execute(): Promise<void> {
    const gitService = new GitService()

    if (!gitService.isAvailable()) {
      createErrorNotification(`GitService: unavailable...`)
      return
    }

    const diff = await getGitDifferences(gitService)
    if (diff) {
      const s = await getComments(diff)
      const comments = s.replace(/<\s*think\s*>(.*?)<\/think>/gs, '').trim()

      createDebugNotification(
        `GitService: diff(${diff.length}) ~ comments(${comments.length})`
      )
      gitService.setSCMInputBoxMessage(comments)
    } else {
      createErrorNotification(`GitService: empty difference`)
    }
  }
}
