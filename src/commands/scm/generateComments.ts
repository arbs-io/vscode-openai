import { Command } from '../commandManager'
import { GitService, getComments, getGitDifferences } from '@app/apis/git'
import { createErrorNotification, createDebugNotification } from '@app/apis/node'

export default class GenerateCommentsCommand implements Command {
  public readonly id = '_vscode-openai.scm.generate.comments'

  public async execute() {
    const gitService = new GitService()

    if (!gitService.isAvailable()) {
      createErrorNotification(`GitService: unavailable...`)
      return
    }

    const diff = await getGitDifferences(gitService)
    if (diff) {
      const comments = await getComments(diff)
      createDebugNotification(
        `GitService: diff(${diff.length}) ~ comments(${comments.length})`
      )
      gitService.setSCMInputBoxMessage(comments)
    } else {
      createErrorNotification(`GitService: empty difference`)
    }
  }
}
