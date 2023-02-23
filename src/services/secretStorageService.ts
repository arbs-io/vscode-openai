import { SecretStorage } from 'vscode'

export class LocalStorageService {
  constructor(private storage: SecretStorage) {}

  public async getValue(key: string): Promise<string> {
    return await this.storage.get(key).then((secret) => (secret ? secret : ''))
  }

  public async setValue(key: string, value: string) {
    this.storage.store(key, value)
  }
}
