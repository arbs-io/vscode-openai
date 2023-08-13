import { Command } from '../commandManager'
import { GitService, getComments, getGitDifferences } from '@app/apis/git'

export default class GenerateCommentsCommand implements Command {
  public readonly id = '_vscode-openai.scm.generate.comments'

  public async execute() {
    const gitService = new GitService()
    if (gitService.isAvailable()) {
      const differences = await getGitDifferences(gitService)
      if (differences) {
        const comments = await getComments(differences)
        gitService.setSCMInputBoxMessage(comments)
      }
    }
  }
}
