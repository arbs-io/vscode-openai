import { Configuration, OpenAIApi } from 'openai'
import { errorHandler } from './errorHandler'
import { HttpRequest, createErrorNotification } from '@app/utilities/node'
import { ModelCapabiliy } from './modelCapabiliy'
import { ConfigurationSettingService } from '@app/services'

export interface IDeploymentModel {
  deployment: string
  model: string
}

export async function listModelsAzureOpenAI(
  apiKey: string,
  baseUrl: string,
  modelCapabiliy: ModelCapabiliy
): Promise<Array<IDeploymentModel> | undefined> {
  try {
    const headers = ConfigurationSettingService.instance.apiHeaders
    const configuration = new Configuration({
      apiKey: apiKey,
      basePath: baseUrl,
    })
    const openai = new OpenAIApi(configuration)

    const response = await openai.listModels({
      headers: { ...headers, 'api-key': apiKey },
      params: { 'api-version': '2023-05-15' },
    })

    const models = new Array<string>()
    response.data.data.forEach((model: any) => {
      if (
        (modelCapabiliy == ModelCapabiliy.ChatCompletion &&
          model.capabilities.chat_completion) ||
        (modelCapabiliy == ModelCapabiliy.Embedding &&
          model.capabilities.embeddings)
      ) {
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
      createErrorNotification(
        'Azure DeploymentModels not found (requires: gpt-3.5 and above)'
      )
    }
    return deployments.sort((a, b) => b.deployment.localeCompare(a.deployment))
  } catch (error: any) {
    errorHandler(error)
    return undefined
  }
}
