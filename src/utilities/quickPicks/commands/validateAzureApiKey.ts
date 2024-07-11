export async function validateAzureApiKey(
  name: string
): Promise<string | undefined> {
  const OPENAI_APIKEY_LENGTH = 32
  // Native azure service key or oauth2 token
  return name.length >= OPENAI_APIKEY_LENGTH
    ? undefined
    : 'Invalid Api-Key or Token'
}
