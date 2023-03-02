import { window, workspace } from 'vscode'
import { Configuration, OpenAIApi } from 'openai'
import SecretStorageService from '../services/secretStorageService'

export async function completionComments(prompt: string): Promise<string> {
  try {
    window.setStatusBarMessage(`$(sync~spin) vscode-openai`)
    const apiKey = await SecretStorageService.instance.getAuthApiKey()
    const model = workspace
      .getConfiguration('vscode-openai')
      .get('default-model') as string

    const configuration = new Configuration({
      apiKey: apiKey,
    })
    const openai = new OpenAIApi(configuration)

    const response = await openai.createCompletion({
      model: model,
      prompt: prompt,
      temperature: 0.2,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    const answer = response.data.choices[0].text
    console.log(answer)

    window.setStatusBarMessage(`$(key) vscode-openai`)
    return answer ? answer : ''
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status)
      console.log(error.response.data)
      throw error
    } else {
      console.log(error.message)
      throw error
    }
  }
}
