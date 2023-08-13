import { ExtensionContext } from 'vscode'

import { createDebugNotification } from '@app/apis/node'
import { validateApiKey } from '@app/apis/openai'

import {
  ConversationStorageService,
  EmbeddingStorageService,
} from './storageServices'

import { registerConfigurationMonitorService } from './configurationMonitorServices'
import {
  ConfigurationConversationService,
  ConfigurationEmbeddingService,
  ConfigurationSettingService,
} from './configurationServices'
import { GlobalStorageService, SecretStorageService } from '@app/apis/vscode'
import { enableServiceFeature } from './featureFlagServices'

export {
  ConfigurationSettingService,
  ConfigurationConversationService,
  ConfigurationEmbeddingService,
} from './configurationServices'

export {
  ConversationStorageService,
  EmbeddingStorageService,
} from './storageServices'

export {
  enableServiceFeature,
  featureVerifyApiKey,
} from './featureFlagServices'

export function registerVscodeOpenAIServices(context: ExtensionContext) {
  //register storage (Singletons)
  createDebugNotification('initialise storage services')
  SecretStorageService.init(context)
  GlobalStorageService.init(context)

  createDebugNotification('starting vscode services')
  registerConfigurationMonitorService(context)
  ConversationStorageService.init(context)
  EmbeddingStorageService.init(context)

  //load configuration
  createDebugNotification('initialise configuration service')
  ConfigurationSettingService.LogConfigurationService()
  ConfigurationConversationService.LogConfigurationService()
  ConfigurationEmbeddingService.LogConfigurationService()

  createDebugNotification('verifying authentication openai service')
  validateApiKey() //On activation check if the api key is valid

  createDebugNotification('verifying enabled features')
  enableServiceFeature()
}
