import { workspace } from 'vscode'
import { Configuration, OpenAIApi } from 'openai'
import SecretStorageService from '../services/secretStorageService'

export async function completionComments(prompt: string) {
  try {
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
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ['!<<<>>>!'],
    })
    const answer = response.data.choices[0].text
    console.log(answer)
    return answer

    // const completion = await openai.createCompletion({
    //   model: model,
    //   prompt: prompt,
    // })
    // console.log(completion.data.choices[0].text)
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status)
      console.log(error.response.data)
    } else {
      console.log(error.message)
    }
  }
}
