import { commands, ExtensionContext, Uri } from 'vscode'

import {
  PromptFactory,
  BountyPromptFactory,
  CommentPromptFactory,
  ExplainPromptFactory,
  OptimizePromptFactory,
  PatternPromptFactory,
  promptCompletion,
} from '../openaiUtilities'
import { compareFileToClipboard } from '../vscodeUtilities'
import { VSCODE_OPENAI_PROMPT } from './constants'

// Define a command registry that uses the factory pattern
class CommandRegistry {
  private factories: Map<string, PromptFactory>

  constructor() {
    this.factories = new Map([
      [
        VSCODE_OPENAI_PROMPT.PROMPT_COMMENTS_COMMAND_ID,
        new CommentPromptFactory(),
      ],
      [
        VSCODE_OPENAI_PROMPT.PROMPT_EXPLAIN_COMMAND_ID,
        new ExplainPromptFactory(),
      ],
      [
        VSCODE_OPENAI_PROMPT.PROMPT_BOUNTY_COMMAND_ID,
        new BountyPromptFactory(),
      ],
      [
        VSCODE_OPENAI_PROMPT.PROMPT_OPTIMIZE_COMMAND_ID,
        new OptimizePromptFactory(),
      ],
      [
        VSCODE_OPENAI_PROMPT.PROMPT_PATTERNS_COMMAND_ID,
        new PatternPromptFactory(),
      ],
    ])
  }

  registerCommands(context: ExtensionContext) {
    for (const [commandId, factory] of this.factories.entries()) {
      const commandHandler = async (uri: Uri) => {
        try {
          const prompt = await factory.createPrompt()()
          const solution = await promptCompletion(prompt)
          compareFileToClipboard(solution)
        } catch (error) {
          console.log(error)
        }
      }
      context.subscriptions.push(
        commands.registerCommand(commandId, commandHandler)
      )
    }
  }
}

// Register the commands using the registry
export function registerEditorCompletion(context: ExtensionContext) {
  const registry = new CommandRegistry()
  registry.registerCommands(context)
}
