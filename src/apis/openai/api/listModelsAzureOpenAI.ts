import { OpenAI } from 'openai'
import { errorHandler } from './errorHandler'
import { HttpRequest, createErrorNotification } from '@app/apis/node'
import { ModelCapability } from './modelCapabiliy'
import { ConfigurationSettingService } from '@app/services'

export interface IDeploymentModel {
  deployment: string
  model: string
}

export async function listModelsAzureOpenAI(
  apiKey: string,
  baseUrl: string,
  modelCapabiliy: ModelCapability
): Promise<Array<IDeploymentModel> | undefined> {
  try {
    const headers = ConfigurationSettingService.apiHeaders
    const azureApiVersion = ConfigurationSettingService.azureApiVersion

    const openai = new OpenAI({
      apiKey: apiKey,
      defaultQuery: { 'api-version': azureApiVersion },
      defaultHeaders: { 'api-key': apiKey },
      baseURL: baseUrl,
    })

    const respModels = await openai.models.list({
      headers: { ...headers, 'api-key': apiKey },
      query: { 'api-version': '2024-02-01' },
    })

    const models = new Array<string>()
    respModels.data.forEach((model: any) => {
      if (
        (modelCapabiliy == ModelCapability.ChatCompletion &&
          model.capabilities.chat_completion) ||
        (modelCapabiliy == ModelCapability.Embedding &&
          model.capabilities.embeddings)
      ) {
        models.push(model.id)
      }
    })

    // ms has ended support for model/deployment api, post gpt-4o. This is a hack/fix
    if (modelCapabiliy == ModelCapability.ChatCompletion) models.push('gpt-4o')

    //Get all deployments
    const request = new HttpRequest(
      'GET',
      apiKey,
      `${baseUrl}/deployments?api-version=2022-12-01`
    )
    const respDeployments = await request.send()

    const deployments = new Array<IDeploymentModel>()
    respDeployments.data.forEach((deployment: any) => {
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
