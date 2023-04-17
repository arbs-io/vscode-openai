import { Configuration, OpenAIApi } from 'openai'
import { errorHandler } from './errorHandler'

export async function azureListModels(
  apiKey: string,
  baseUrl: string
): Promise<Array<string>> {
  try {
    const models = new Array<string>()
    const configuration = new Configuration({
      apiKey: apiKey,
      basePath: baseUrl,
    })
    const openai = new OpenAIApi(configuration)

    const response = await openai.listModels({
      headers: { 'api-key': apiKey },
      params: { 'api-version': '2023-03-15-preview' },
    })

    response.data.data.forEach((model: any) => {
      if (model.capabilities.chat_completion) {
        models.push(model.id)
      }
    })
    return models.sort((a, b) => b.localeCompare(a))
  } catch (error: any) {
    errorHandler(error)
    throw error
  }
}

// let url = `${base_url}/openai/deployments/${deploymentName}/completions?api-version=2022-12-01`;
// export default async function (req, res) {
//   try {
//       const response = await fetch(url, {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//               'api-key': apiKey
//           },
//           body: JSON.stringify(generatePrompt(req.body.prompt))
//       });

//       if (!response.ok) {
//           console.log(`HTTP Code: ${response.status} - ${response.statusText}`);
//       } else {
//           const completion = await response.json();
//           res.status(200).json({ result: completion.choices[0].text });
//       }
//   } catch(e) {
//       console.error(e);
//   }
// }
// function fetch(url: any, arg1: { method: string; headers: { 'Content-Type': string; 'api-key': any }; body: string }) {
//   throw new Error('Function not implemented.')
// }
