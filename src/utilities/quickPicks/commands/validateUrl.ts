import { Uri } from 'vscode'

export async function validateUrl(
  baseUrl: string
): Promise<string | undefined> {
  return Uri.parse(baseUrl) ? undefined : 'Invalid Uri'
}
