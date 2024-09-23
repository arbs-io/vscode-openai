import {
  ChatCompletionConfig,
  ChatCompletionModelType,
} from '@app/services/configuration'

export async function isSystemRoleAllowed(): Promise<boolean> {
  const cfg = ChatCompletionConfig.create(ChatCompletionModelType.INFERENCE)

  return !cfg.model.startsWith('o1')
}
