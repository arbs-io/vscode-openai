import { getActiveTextEditorValue } from '../../utils/getActiveTextEditorValue'
import { getActiveTextLanguageId } from '../../utils/getActiveTextLanguageId'

export async function bountyPrompt(): Promise<string> {
  const language = getActiveTextLanguageId()
  const inputCode = getActiveTextEditorValue()

  const persona = `Act like a programming expert in ${language}.\n`
  const request = `Fix the bugs in the following source code and include comments next to the fixed code to explain any changes made. Use the prefix "Bugfix: " for each comment where necessary:\n`
  const sourceCode = `\n${inputCode}\n\n`
  const rules = ``
  const prompt = persona.concat(request, sourceCode, rules)
  return prompt
}
