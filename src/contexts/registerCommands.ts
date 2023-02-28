// import { commands, ExtensionContext, Uri, window } from 'vscode'
// import { executePrompt } from '../openai/completionComments'
// import { getActiveTextEditorValue } from '../utils/getActiveTextEditorValue'
// import {
//   OPENAI_UNITTEST_COMMAND_ID,
//   OPENAI_FINDBUG_COMMAND_ID,
// } from './openaiCommands'

// export function registerCommands(context: ExtensionContext) {
//   _registerCommand(context, OPENAI_UNITTEST_COMMAND_ID, 'todo')
//   _registerCommand(context, OPENAI_FINDBUG_COMMAND_ID, 'todo')
// }

// function _registerCommand(
//   context: ExtensionContext,
//   openaiCommand: string,
//   prompt: string
// ) {
//   const commandHandler = async (uri: Uri) => {
//     const editorValue = getActiveTextEditorValue()

//     await executePrompt()

//     window.showInformationMessage(`OpenAI: $copied to clipboard`)
//   }
//   context.subscriptions.push(
//     commands.registerCommand(openaiCommand, commandHandler)
//   )
// }
