import { Configuration, OpenAIApi } from 'openai'
import SecretStorageService from '../services/secretStorageService'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export async function executePrompt() {
  try {
    //SecretStorageService.instance.setAuthApiKey('api-key')
    const apiKey = await SecretStorageService.instance.getAuthApiKey()
    console.log(apiKey)

    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: 'Hello world',
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
