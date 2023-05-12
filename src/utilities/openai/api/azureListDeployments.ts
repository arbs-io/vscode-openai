import { Configuration, OpenAIApi } from 'openai'
import { errorHandler } from './errorHandler'
import { HttpRequest, handleError } from '@app/utilities/node'

export interface IDeploymentModel {
  deployment: string
  model: string
}

export async function azureListDeployments(
  apiKey: string,
  baseUrl: string
): Promise<Array<IDeploymentModel> | undefined> {
  try {
    const configuration = new Configuration({
      apiKey: apiKey,
      basePath: baseUrl,
    })
    const openai = new OpenAIApi(configuration)

    const response = await openai.listModels({
      headers: { 'api-key': apiKey },
      params: { 'api-version': '2023-03-15-preview' },
    })

    const models = new Array<string>()
    response.data.data.forEach((model: any) => {
      if (model.capabilities.chat_completion) {
        models.push(model.id)
      }
    })

    //Get all deployments
    const request = new HttpRequest(
      'GET',
      apiKey,
      `${baseUrl}/deployments?api-version=2022-12-01`
    )
    const resp = await request.send()

    const deployments = new Array<IDeploymentModel>()
    resp.data.forEach((deployment: any) => {
      if (models.includes(deployment.model)) {
        const deploymentModel: IDeploymentModel = {
          deployment: deployment.id,
          model: deployment.model,
        }
        deployments.push(deploymentModel)
      }
    })
    if (deployments.length === 0) {
      handleError(
        'Azure DeploymentModels not found (requires: gpt-3.5 and above)'
      )
    }
    return deployments.sort((a, b) => b.deployment.localeCompare(a.deployment))
  } catch (error: any) {
    errorHandler(error)
    return undefined
  }
}
