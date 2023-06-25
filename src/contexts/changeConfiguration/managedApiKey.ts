import { verifyApiKey } from '@app/utilities/openai'
import { waitFor } from '@app/utilities/node'
import { ConfigurationService } from '@app/services'

export class ManagedApiKey {
  private static instance: ManagedApiKey
  private _isQueued = false

  public static getInstance(): ManagedApiKey {
    if (!ManagedApiKey.instance) {
      ManagedApiKey.instance = new ManagedApiKey()
    }
    return ManagedApiKey.instance
  }

  public async verify(): Promise<void> {
    if (this._isQueued === true) return

    this._isQueued = true
    await waitFor(500, () => false)
    await verifyApiKey()
    ConfigurationService.LogConfigurationService()
    this._isQueued = false
  }
}
