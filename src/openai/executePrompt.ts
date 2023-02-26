import { Configuration, OpenAIApi } from 'openai'
import SecretStorageService from '../services/secretStorageService'

export async function executePrompt() {
  try {
    const apiKey = await SecretStorageService.instance.getAuthApiKey()
    console.log(apiKey)

    const configuration = new Configuration({
      apiKey: apiKey,
    })
    const openai = new OpenAIApi(configuration)

    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: 'who is tesla',
    })
    console.log(completion.data.choices[0].text)
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status)
      console.log(error.response.data)
    } else {
      console.log(error.message)
    }
  }
}
