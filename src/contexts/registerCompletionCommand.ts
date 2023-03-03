import { commands, ExtensionContext, Uri } from 'vscode'

import {
  PromptFactory,
  BountyPromptFactory,
  CommentPromptFactory,
  ExplainPromptFactory,
  OptimizePromptFactory,
  PatternPromptFactory,
  completionComments,
} from '../openai-utils'

import { compareFileToClipboard } from '../vscode-utils'

import {
  PROMPT_BOUNTY_COMMAND_ID,
  PROMPT_COMMENTS_COMMAND_ID,
  PROMPT_EXPLAIN_COMMAND_ID,
  PROMPT_OPTIMIZE_COMMAND_ID,
  PROMPT_PATTERNS_COMMAND_ID,
} from './openaiCommands'

// Define a command registry that uses the factory pattern
class CommandRegistry {
  private factories: Map<string, PromptFactory>

  constructor() {
    this.factories = new Map([
      [PROMPT_COMMENTS_COMMAND_ID, new CommentPromptFactory()],
      [PROMPT_EXPLAIN_COMMAND_ID, new ExplainPromptFactory()],
      [PROMPT_BOUNTY_COMMAND_ID, new BountyPromptFactory()],
      [PROMPT_OPTIMIZE_COMMAND_ID, new OptimizePromptFactory()],
      [PROMPT_PATTERNS_COMMAND_ID, new PatternPromptFactory()],
    ])
  }

  registerCommands(context: ExtensionContext) {
    for (const [commandId, factory] of this.factories.entries()) {
      const commandHandler = async (uri: Uri) => {
        try {
          const prompt = await factory.createPrompt()()
          const solution = await completionComments(prompt)
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
export function registerCompletionCommand(context: ExtensionContext) {
  const registry = new CommandRegistry()
  registry.registerCommands(context)
}
