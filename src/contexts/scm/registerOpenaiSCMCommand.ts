//https://github.com/microsoft/vscode/issues/108046
import {
  commands,
  ExtensionContext,
  extensions,
  scm,
  Uri,
  workspace,
} from 'vscode'
import { VSCODE_OPENAI_SCM } from '@app/contexts'
import { showMessageWithTimeout } from '@app/utilities/vscode'
// import { getGitApi } from './gitHelper'
import * as vscodegit from './vendor/git'

export function registerOpenaiSCMCommand(context: ExtensionContext) {
  _registerOpenaiSCMCommand(context)
}

function _registerOpenaiSCMCommand(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand(VSCODE_OPENAI_SCM.COMMENT_COMMAND_ID, async () => {
      showMessageWithTimeout('working...', 1000)

      const repo = getGitAPI()
      repo.repositories[0].inputBox.value = 'openai...'

      repo.repositories[0].ui.onDidChange((e) => {
        repo.repositories[0].ui.selected
        showMessageWithTimeout(
          `ui ${repo.repositories[0].rootUri.path}  ${repo.repositories[0].ui.selected}`,
          10000
        )
        console.log('repo', e)
      })
      repo.repositories[0].state.onDidChange((e) => {
        showMessageWithTimeout(`repo ${e}`, 1000)
        console.log('repo', e)
      })
    })
  )
}

function getGitAPI(): vscodegit.API {
  const vscodeGit = extensions.getExtension('vscode.git')
  if (!vscodeGit?.exports.getAPI(1)) {
    showMessageWithTimeout('failed to get api...', 1000)
    // output.error('getGitAPI', getSourcesLocalize('vscodeGitNotFound'), true)
  }
  return vscodeGit!.exports.getAPI(1)
}
