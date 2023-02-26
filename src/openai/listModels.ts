import { Configuration, OpenAIApi } from "openai";
import SecretStorageService from '../services/secretStorageService';

export async function listModels() {
  try {
    //SecretStorageService.instance.setAuthApiKey('sk-E...kmx')
    const apiKey = await SecretStorageService.instance.getAuthApiKey()
    console.log(apiKey)

    const configuration = new Configuration({
      apiKey: apiKey,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.listModels();
    console.log(response.data.data)
    return response.data.data

  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status)
      console.log(error.response.data)
    } else {
      console.log(error.message)
    }
  }
}
